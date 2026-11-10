export default async function Page({
  params,
}: {
  params: Promise<{ ambiente: string }>;
}) {
  const { ambiente } = await params;
  return <main>{ambiente}</main>;
}
