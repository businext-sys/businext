import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Employee } from "../employee";
import { mapEmployeeFromApi } from "../mappers/employee";

/**
 * NOTA (issue #028): el nombre de esta ruta diverge entre el BFF de
 * apps/web (`/api/personal-management`) y el backend real (`/employees/`)
 * — no es solo el prefijo `/api`. Se usa `client.apiPrefix` para elegir
 * el sufijo correcto (ver tambien `financesApi.listAnual` para el mismo
 * patron).
 */
function buildPath(client: ApiClient): string {
  return client.apiPrefix ? "/personal-management" : "/employees";
}

export const employeeApi = {
  list: (client: ApiClient = apiClient): Promise<Employee[]> =>
    client
      .get<Record<string, unknown>[]>(buildPath(client))
      .then((data) => data.map(mapEmployeeFromApi)),
};
