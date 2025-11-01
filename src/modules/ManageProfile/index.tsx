import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input, { DateInput, SelectInput, TelInput } from "@/components/Input";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ActionButton } from "@/components/Button";
import Popup from "@/components/Popup/Popup";
import {
  useAllPastoralRole,
  useCGDetails,
  useUpdateSinglePerson,
} from "@/graphql";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useCreateCGInvite,
  usePendingCGInvites,
} from "@/graphql/hooks/connect-group";
import toast from "react-hot-toast";

type ManageProfileForm = {
  name: string;
  contact: string;
  gender: string;
  dob: string;
  role: string;
};

export const ManageProfile = () => {
  const cgId = sessionStorage.getItem("currentCgId");
  const { setTitle, setWhite, setRightIcon, setFixed, setBg, setShowBack } =
    useContext(TitleContext);

  const { user } = useAuth0();
  const navigate = useNavigate();

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: "success" | "partial" | "error";
  }>({
    isOpen: false,
    type: "success",
  });

  useEffect(() => {
    setRightIcon(null);
    setWhite(false);
    setTitle("Complete Profile");
    setFixed(false);
    setShowBack(true);
    setBg("transparent");
  }, [setRightIcon, setWhite, setTitle, setFixed, setBg, setShowBack]);

  const { data } = useCGDetails(cgId ?? "");
  const cg = data?.connect_groupCollection.edges[0]?.node.id;

  const { data: pendingInvitesData } = usePendingCGInvites(cg ?? "");

  // Check for pending invitation and redirect if found
  useEffect(() => {
    if (pendingInvitesData && user?.sub && cgId) {
      const userPendingInvite =
        pendingInvitesData.connect_group_inviteCollection.edges.find(
          (invite) => invite.node.user.id === user.sub,
        );

      if (userPendingInvite) {
        toast.error("You already have a pending submission to this group");
        navigate(`/cg/${cgId}`, { replace: true });
      }
    }
  }, [pendingInvitesData, user?.sub, cgId, navigate]);
  const { data: pastoralRoles, isLoading } = useAllPastoralRole();
  const mappedPastoralRoles = pastoralRoles?.pastoral_roleCollection.edges
    // Filter out the CGL
    .filter((role) => role.node.weight >= 5)
    .map((role) => ({
      label: role.node.name,
      value: role.node.id,
    }));

  const updateSinglePerson = useUpdateSinglePerson();
  const createInvite = useCreateCGInvite();

  // Get popup content based on state
  const getPopupContent = () => {
    switch (popupState.type) {
      case "success":
        return {
          title: "Profile Setup Complete!",
          message:
            "Your profile has been updated and you've been added to the connect group. Welcome!",
          buttonText: "Continue",
          showImage: true,
        };
      case "partial":
        return {
          title: "Profile Updated",
          message:
            "Your profile was updated successfully, but there was an issue adding you to the group. Please contact your group leader.",
          buttonText: "Okay",
          showImage: false,
        };
      case "error":
        return {
          title: "Something Went Wrong",
          message:
            "We couldn't update your profile. Please check your information and try again.",
          buttonText: "Close",
          showImage: false,
        };
    }
  };

  const popupContent = getPopupContent();

  return (
    <>
      <Popup
        isOpen={popupState.isOpen}
        title={popupContent.title}
        onClose={() => {
          setPopupState({ isOpen: false, type: "success" });
          if (popupState.type === "success") {
            navigate(`/cg/${cgId}`, {
              viewTransition: true,
            });
          }
        }}
        customImage={
          popupContent.showImage ? (
            <img
              src="/task_done.png"
              className="w-[200px] object-contain"
              alt="Task Done"
            />
          ) : undefined
        }
        buttonText={popupContent.buttonText}
      >
        <p className="text-gray text-center">{popupContent.message}</p>
      </Popup>
      <div className="flex h-full w-full flex-col gap-5 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <Formik<ManageProfileForm>
            initialValues={{
              name: user?.name ?? "",
              contact: user?.phone_number ?? "",
              gender: user?.gender ?? "",
              role: mappedPastoralRoles?.[0]?.value ?? "",
              dob: user?.birthdate ?? "",
            }}
            validateOnChange={false}
            onSubmit={(values, action) => {
              action.setSubmitting(true);
              console.log(values);
              updateSinglePerson.mutate(
                {
                  name: values.name.trim(),
                  gender: values.gender.trim(),
                  date_of_birth: values.dob,
                  phone_number: values.contact.trim(),
                  uid: user?.sub ?? "",
                },
                {
                  onSuccess: () => {
                    // Create invite after successfully updating person
                    if (cg && user?.sub) {
                      createInvite.mutate(
                        {
                          cg_id: cg,
                          user_id: user.sub,
                          created_by: user.sub,
                        },
                        {
                          onSuccess: () => {
                            console.log("Invite created successfully");
                            toast.success("Profile setup complete!");
                            action.resetForm();
                            setPopupState({ isOpen: true, type: "success" });
                          },
                          onError: (error) => {
                            console.error("Error creating invite:", error);
                            toast.error(
                              "Profile updated but couldn't add to group",
                            );
                            action.resetForm();
                            setPopupState({ isOpen: true, type: "partial" });
                          },
                          onSettled: () => {
                            action.setSubmitting(false);
                          },
                        },
                      );
                    } else {
                      console.error("Missing CG ID or user ID");
                      toast.error("Profile updated but couldn't add to group");
                      action.resetForm();
                      setPopupState({ isOpen: true, type: "partial" });
                      action.setSubmitting(false);
                    }
                  },
                  onError: (error) => {
                    console.error("Error updating person:", error);
                    toast.error("Failed to update profile. Please try again.");
                    setPopupState({ isOpen: true, type: "error" });
                    action.setSubmitting(false);
                  },
                },
              );
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Required."),
              contact: Yup.string()
                .required("Required.")
                .test("validity", "Invalid Phone Number.", (val) => {
                  if (val) {
                    return isValidPhoneNumber(val);
                  }
                }),
              gender: Yup.string().required("Required."),
              dob: Yup.date()
                .required("Required.")
                .max(new Date(), "Date of birth cannot be in the future."),

              role: Yup.string().required("Required."),
            })}
          >
            {({ submitForm, isSubmitting }) => (
              <Form className="flex w-full flex-col gap-3">
                <Input
                  label="Name"
                  name="name"
                  placeholder="Please enter the name"
                  required
                />
                <TelInput
                  label="Contact No."
                  required
                  name="contact"
                  placeholder="Etc: 123456789"
                />
                <Input
                  type="radio"
                  label="Gender"
                  name="gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                />
                <SelectInput
                  required
                  label="Pastoral Role"
                  name="role"
                  loading={isLoading}
                  options={
                    mappedPastoralRoles ?? [{ label: "Loading...", value: "" }]
                  }
                />
                <DateInput label="Date of birth" name="dob" required />

                <ActionButton
                  extendedPaddingY
                  disabled={isSubmitting}
                  type="button"
                  loading={isSubmitting}
                  label="Add"
                  onClick={submitForm}
                />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};
