import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAllAttendance, getLatestCGAttendance } from "../server";
import type {
  GetAllAttendanceResponse,
  GetLatestCGAttendanceResponse,
} from "@/types/graphql";

export const attendanceQueries = {
  default: [{ scope: "attendance" }] as const,
  latestCGAttendance: (uid: string) =>
    queryOptions({
      queryKey: [
        { ...attendanceQueries.default[0], type: "latest_cg_attendance", uid },
      ] as const,
      queryFn: (): Promise<GetLatestCGAttendanceResponse> =>
        getLatestCGAttendance(uid),
    }),
  allAttendance: (uid: string) =>
    queryOptions({
      queryKey: [
        { ...attendanceQueries.default[0], type: "all_attendance", uid },
      ] as const,
      queryFn: (): Promise<GetAllAttendanceResponse> => getAllAttendance(uid),
    }),
};

// Query hooks
export const useLatestCGAttendance = (uid: string) =>
  useSuspenseQuery(attendanceQueries.latestCGAttendance(uid));

export const useAllAttendance = (uid: string) =>
  useSuspenseQuery(attendanceQueries.allAttendance(uid));
