export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey || apiKey === "<your-imgbb-api-key>") {
    throw new Error(
      "NEXT_PUBLIC_IMGBB_API_KEY is not configured in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data?.success || !data?.data?.url) {
    throw new Error(data?.error?.message || "ImgBB image upload failed");
  }

  return data.data.url as string;
}
