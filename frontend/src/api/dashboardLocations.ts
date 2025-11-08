/**
 * Dashboard Locations API
 * Fetches locations filtered by organization
 */
import * as reactQuery from "@tanstack/react-query";
import { bookingApiFetch } from "./bookingApiFetcher";
import type * as Schemas from "./bookingApiSchemas";

export type GetDashboardLocationsQueryParams = {
  limit?: number;
  locationType?: Schemas.LocationType;
};

export type GetDashboardLocationsHeaders = {
  "X-Organization-Id": string;
};

export type GetDashboardLocationsError = {
  status: number;
  payload: string;
};

export type GetDashboardLocationsResponse = Schemas.LocationDto[];

export type GetDashboardLocationsVariables = {
  headers: GetDashboardLocationsHeaders;
  queryParams?: GetDashboardLocationsQueryParams;
};

export const fetchGetDashboardLocations = (
  variables: GetDashboardLocationsVariables,
  signal?: AbortSignal,
) =>
  bookingApiFetch<
    GetDashboardLocationsResponse,
    GetDashboardLocationsError,
    undefined,
    GetDashboardLocationsHeaders,
    GetDashboardLocationsQueryParams,
    {}
  >({
    url: "/api/dashboard/locations",
    method: "get",
    ...variables,
    signal
  });

export function getDashboardLocationsQuery(
  variables: GetDashboardLocationsVariables,
) {
  // Custom query key for dashboard locations
  const queryKey: unknown[] = ['api', 'dashboard', 'locations'];

  if (variables.headers?.['X-Organization-Id']) {
    queryKey.push(variables.headers['X-Organization-Id']);
  }

  if (variables.queryParams) {
    queryKey.push(variables.queryParams);
  }

  return {
    queryKey,
    queryFn: ({ signal }: { signal?: AbortSignal }) =>
      fetchGetDashboardLocations(variables, signal),
  };
}

export const useGetDashboardLocations = <TData = GetDashboardLocationsResponse,>(
  variables: GetDashboardLocationsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      GetDashboardLocationsResponse,
      GetDashboardLocationsError,
      TData
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return reactQuery.useQuery<
    GetDashboardLocationsResponse,
    GetDashboardLocationsError,
    TData
  >({
    ...getDashboardLocationsQuery(variables),
    ...options,
  });
};
