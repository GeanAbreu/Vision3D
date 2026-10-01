import { getProjectName, projectCapabilities } from "@/lib/project";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-amber-300/20 bg-zinc-900 p-8 shadow-2xl shadow-amber-500/10 sm:p-14">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Catálogo online de objetos 3D
        </p>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
          {getProjectName().slice(0, -2)}
          <span className="text-amber-400">3D</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
          Uma experiência simples para descobrir objetos 3D, calcular o frete e
          solicitar atendimento personalizado pelo WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-zinc-300">
          {projectCapabilities.map((feature) => (
            <span
              className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2"
              key={feature}
            >
              {feature}
            </span>
          ))}
        </div>
        <p className="mt-12 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
          Fundação técnica concluída. O catálogo será disponibilizado nas
          próximas etapas do projeto.
        </p>
      </section>
    </main>
  );
}
