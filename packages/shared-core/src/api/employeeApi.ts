import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Employee } from "../employee";
import { mapEmployeeFromApi } from "../mappers/employee";

const PATH = "/api/personal-management";

export const employeeApi = {
  list: (client: ApiClient = apiClient): Promise<Employee[]> =>
    client
      .get<Record<string, unknown>[]>(PATH)
      .then((data) => data.map(mapEmployeeFromApi)),
};
