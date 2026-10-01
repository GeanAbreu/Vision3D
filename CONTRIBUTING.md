# Como contribuir

## Fluxo de trabalho

1. Crie uma Issue com contexto, objetivo, escopo e critérios de aceite.
2. Crie uma branch curta a partir da `main`, seguindo o padrão descrito em `AGENTS.md`.
3. Implemente somente o escopo da Issue.
4. Execute todas as verificações locais.
5. Abra um Pull Request pequeno, revisável e vinculado à Issue.

## Verificações locais

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

## Commits

Use Conventional Commits no formato:

```text
tipo(escopo): descrição curta no imperativo
```

Nunca inclua credenciais, arquivos `.env` reais, dados pessoais ou outros segredos no repositório.
