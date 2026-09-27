This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## BeeWise public auth launch notice

Set these server environment variables for the `apps/sale` deployment:

```env
BEEWISE_AUTH_PAUSED=true
BEEWISE_AUTH_NOTICE_TEXT="BeeWise đang chuẩn bị ra mắt. Chức năng đăng nhập và đăng ký sẽ sớm mở."
```

When enabled, the notice and disabled login/register forms appear only on `beewise.vn` and `www.beewise.vn`. POST requests to `/api/auth/login/*` and `/api/auth/register` on those hosts return 503. Test domains and localhost continue to work. Set `BEEWISE_AUTH_PAUSED=false` (or remove it) to reopen public auth, then restart or redeploy the sale server so the new environment value takes effect. The notice text is optional; the app has a default message.

The production ingress must preserve the original `Host` header so the sale app can distinguish the public and test domains.

If the backend auth API is directly reachable outside the sale app, enforce the same public launch policy at the backend or ingress as well.

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
