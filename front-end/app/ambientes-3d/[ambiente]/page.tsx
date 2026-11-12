type PageProps = { params: Promise<{ ambiente: string }> };

export default async function Page({ params }: PageProps) {
  const { ambiente } = await params;
  return <main>{ambiente}</main>;
}
