import Nokori from "../islands/Nokori.tsx";
import qs from "npm:qs";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req: Request, ctx: HandlerContext) {
    console.log(ctx.url.search);
    const a = qs.parse(ctx.url.search, { ignoreQueryPrefix: true });
    return ctx.render({
      未来日: a.futureDate || "",
      過去日: a.pastDate || "",
    });
  },
};

export default function Home(props: PageProps) {
  console.log(props.data);
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Welcome to Nokori</h1>
        <p class="my-4">
          残りの日を数えるアプリです。
        </p>
        <Nokori {...props.data} />
      </div>
    </div>
  );
}
