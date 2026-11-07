# Itamatay Veículos

Site em Next.js com consultas públicas no servidor, navegação progressiva e integração de publicação com o ERP.

- [Carregamento, medições e ativação do cache](docs/performance.md)
- [Testes locais de navegação e falhas](tests/README.md)
- Configuração inicial: `.env.example`. Mantenha segredos em `.env.local` ou no ambiente de hospedagem.

Validações: `npm run lint`, `npm exec tsc -- --noEmit`, `npm test` e `npm run build`. O cache compartilhado permanece desativado até validar a publicação pelo ERP.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
