/** Every Server Action returns this — never throws to the client. `error` is a human-readable Spanish message. */
export type ActionResult<TData = true> = { ok: true; data: TData } | { ok: false; error: string };

export function actionSuccess<TData>(data: TData): ActionResult<TData> {
  return { ok: true, data };
}

export function actionFailure<TData = true>(error: string): ActionResult<TData> {
  return { ok: false, error };
}
