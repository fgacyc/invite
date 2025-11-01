import { Field, useFormikContext } from "formik";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import React, { useState, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

interface InputProps {
  label: string;
  name: string;
  type?: "text" | "tel" | "radio" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  countryCode?: string[];
  selectedCountryCode?: string;
  hint?: string;
}

export const ImageInput: React.FC<InputProps & { previewUrl?: string }> = ({
  label,
  name,
  required,
  hint,
  previewUrl: externalPreviewUrl,
}) => {
  const { errors, values, setFieldValue } =
    useFormikContext<Record<string, unknown>>();
  const errorValue = errors[name];
  const error = typeof errorValue === "string" ? errorValue : "";

  // Get the form value - should be a File object when user selects a file
  const formValue = values[name];

  // Generate preview URL based on priority: new file > external preview > empty
  const getDisplayUrl = () => {
    // If user selected a new file, show that preview
    if (formValue instanceof File) {
      return URL.createObjectURL(formValue);
    }

    // If there's an external preview URL (existing image), show that
    if (externalPreviewUrl) {
      return externalPreviewUrl;
    }

    // No preview available
    return "";
  };

  const displayUrl = getDisplayUrl();

  // Cleanup object URLs when component unmounts or form value changes
  useEffect(() => {
    return () => {
      if (formValue instanceof File && displayUrl.startsWith("blob:")) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [formValue, displayUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the File object in Formik values
      setFieldValue(name, file);
    }
  };

  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-dark block text-sm">
          {label} {required && "*"}
        </label>

        <label htmlFor={name} className="w-full cursor-pointer">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={label}
              className="h-[200px] w-full rounded-md border border-gray-300 object-cover"
            />
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-500">
              Click to upload image
            </div>
          )}
          <input
            id={name}
            accept=".jpg,.jpeg,.png"
            type="file"
            name={name}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  options = [],
  hint,
}) => {
  const { errors } = useFormikContext();
  const error = errors[name as keyof typeof errors];

  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-dark block text-sm">
          {label} {required && "*"}
        </label>

        {type === "radio" && options.length > 0 ? (
          <div className="flex space-x-4">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Field
                  type="radio"
                  name={name}
                  className="form-radio text-blue-600"
                  value={option.value}
                />
                <span className="text-dark">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <Field
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-md border ${error ? "border-red-600" : "border-gray-300"} bg-white px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none`}
          />
        )}
      </div>
      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

export default Input;

export const SelectInput: React.FC<InputProps & { loading?: boolean }> = ({
  label,
  name,
  required,
  loading,
  options = [],
  hint,
}) => {
  const { errors } = useFormikContext();
  const error = errors[name as keyof typeof errors];
  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="block text-sm text-[#191D1A]">
          {label} {required && "*"}
        </label>
        <Field
          as="select"
          name={name}
          disabled={loading}
          required={required}
          className={`w-full rounded-md border ${error ? "border-red-600" : "border-gray-300"} bg-white py-2.5 pl-3 placeholder:text-[#92969D] focus:outline-none`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        {hint || error ? (
          <div className="flex w-full flex-row items-center justify-between gap-1">
            {hint && <p className="text-gray w-full text-xs">{hint}</p>}
            <div className="w-full text-end text-xs text-red-600 italic">
              {error}
            </div>
          </div>
        ) : (
          <div className="h-16px" />
        )}
      </div>
    </div>
  );
};

export const TelInput: React.FC<InputProps> = ({
  label,
  name,
  required,
  placeholder,
  hint,
}) => {
  const { errors, setFieldValue } = useFormikContext();
  const [countryCode, setCountryCode] = useState("+60");
  const [telLine, setTelLine] = useState("");

  const supportedCountries = getCountries();
  const uniqueCountryCode = [
    ...new Set(
      supportedCountries
        .map((a) => getCountryCallingCode(a))
        .sort((a, b) => Number(a) - Number(b)),
    ),
  ];
  const error = errors[name as keyof typeof errors];
  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="block text-sm text-[#191D1A]">
          {label} {required && "*"}
        </label>
        <div
          className={`flex items-center rounded-md border ${error ? "border-red-600" : "border-gray-300"} bg-white`}
        >
          <select
            className="w-20 max-w-36 rounded-l-md bg-white py-2.5 pl-3 placeholder:text-[#92969D] focus:outline-none"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setFieldValue(name, `${e.target.value}${telLine}`);
            }}
          >
            {uniqueCountryCode
              .sort((a, b) => Number(a) - Number(b))
              .map((code) => (
                <option key={code} value={`+${code}`}>
                  {`+${code}`}
                </option>
              ))}
          </select>
          <div className="px-2 text-[#92969D]">|</div>
          <input
            placeholder={placeholder}
            type="tel"
            name={name}
            onChange={(e) => {
              setFieldValue(name, `${countryCode}${e.target.value}`);
              setTelLine(e.target.value);
            }}
            value={telLine}
            className="w-full rounded-r-md bg-white py-2.5 pr-3 placeholder:text-[#92969D] focus:outline-none"
          />
        </div>
      </div>
      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

export const DateInput: React.FC<InputProps> = ({
  label,
  required,
  name,
  hint,
}) => {
  const { errors } = useFormikContext();
  const error = errors[name as keyof typeof errors];
  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="block text-sm text-[#191D1A]">
          {label} {required && "*"}
        </label>
        <Field
          name={name}
          type="date"
          className={`w-full rounded-md border ${error ? "border-red-600" : "border-gray-300"} bg-white px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none`}
        />
      </div>
      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

export const TextareaInput: React.FC<InputProps> = ({
  label,
  name,
  required = false,
  placeholder,
  hint,
}) => {
  const { errors } = useFormikContext();
  const error = errors[name as keyof typeof errors];

  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-dark block text-sm">
          {label} {required && "*"}
        </label>

        <Field
          as="textarea"
          name={name}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={`w-full rounded-md border ${error ? "border-red-600" : "border-gray-300"} bg-white px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none`}
        />
      </div>
      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

interface AutoCompleteOption {
  id: string;
  label: string;
  value: string;
}

interface AutoCompleteInputProps extends Omit<InputProps, "options"> {
  onSearch: (query: string) => Promise<AutoCompleteOption[]>;
  onSelect?: (option: AutoCompleteOption) => void;
  onClear?: () => void; // Called when user manually changes the input
  minQueryLength?: number;
  noResultsText?: string;
  loading?: boolean;
  disabled?: boolean;
  disabledOptionId?: string; // ID of option to disable in dropdown
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  hint,
  onSearch,
  onSelect,
  onClear,
  minQueryLength = 1,
  noResultsText = "No results found",
  disabled = false,
  disabledOptionId,
}) => {
  const { errors, setFieldValue, values } = useFormikContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const loadingText = "Searching...";

  const error = errors[name as keyof typeof errors];
  const fieldValue = (values as Record<string, unknown>)[name] as string;

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setFieldValue(name, value);
    setJustSelected(false); // Reset flag when user manually types

    // Clear selection when user manually changes the input
    if (onClear) {
      onClear();
    }
  };

  // Perform the actual search
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setShowDropdown(true);

    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: AutoCompleteOption) => {
    setFieldValue(name, option.value);
    setQuery(option.value);
    setShowDropdown(false);
    setResults([]);
    setJustSelected(true); // Set flag to prevent search from triggering

    // Call onSelect callback if provided
    if (onSelect) {
      onSelect(option);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    // Don't reopen dropdown if user just selected something
    if (justSelected) {
      return;
    }
    if (query.length >= minQueryLength && results.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle input blur (with slight delay to allow clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  // Trigger search when query changes (with debouncing)
  useEffect(() => {
    // Skip search if user just selected an option
    if (justSelected) {
      return;
    }

    if (query.length >= minQueryLength) {
      const timeoutId = setTimeout(() => {
        performSearch(query);
      }, 300); // 300ms debounce delay

      return () => clearTimeout(timeoutId);
    } else {
      // Clear results and hide dropdown if query is too short
      setResults([]);
      setShowDropdown(false);
    }
  }, [query, minQueryLength, justSelected]);

  // Sync query with field value when field value changes externally
  useEffect(() => {
    if (fieldValue !== query) {
      setQuery(fieldValue || "");
    }
  }, [fieldValue]);

  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-dark block text-sm">
          {label} {required && "*"}
        </label>

        <div className="relative">
          <input
            type={type}
            name={name}
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full rounded-md border ${error ? "border-red-600" : "border-gray-300"} ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : "bg-white"} px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none`}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <CgSpinner
                className="animate-spin"
                color="#41FAD3"
                size={24}
              />{" "}
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && !disabled && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {/* Loading indicator at the top if loading */}
              {isLoading && (
                <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                  {loadingText}
                </div>
              )}

              {/* Results */}
              {results.length > 0
                ? results.map((option) => {
                    const isDisabled = disabledOptionId === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`px-3 py-2 text-sm ${
                          isDisabled
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : "cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (!isDisabled) {
                            handleOptionSelect(option);
                          }
                        }}
                        title={
                          isDisabled
                            ? "Member is already in this CG"
                            : undefined
                        }
                      >
                        {option.label}
                        {isDisabled && (
                          <span className="ml-2 text-xs">(Current CG)</span>
                        )}
                      </div>
                    );
                  })
                : !isLoading && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {noResultsText}
                    </div>
                  )}
            </div>
          )}
        </div>
      </div>

      {hint || error ? (
        <div className="flex w-full flex-row items-center justify-between gap-1">
          {hint && <p className="text-gray w-full text-xs">{hint}</p>}
          <div className="w-full text-end text-xs text-red-600 italic">
            {error}
          </div>
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};
