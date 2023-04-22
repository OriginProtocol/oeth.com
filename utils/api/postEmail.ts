interface PostEmailResponse {
  success: boolean;
  message: string;
}

const postEmail = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("source", "oeth.com");

  const fetchRes = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_API}/oeth-subscribe`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!fetchRes.ok) throw new Error("Failed to post email");

  const response: PostEmailResponse = await fetchRes.json();

  return response;
};

export default postEmail;
