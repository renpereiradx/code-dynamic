// Tipos mínimos de Cloudflare para functions/ (evita la dependencia
// @cloudflare/workers-types; Astro no procesa este directorio en el build).
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

type PagesFunction<Env = Record<string, unknown>> = (context: {
  request: Request;
  env: Env;
}) => Promise<Response> | Response;
