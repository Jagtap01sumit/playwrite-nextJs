import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req) {
  try {
    const { keyword, url } = await req.json();

    if (!keyword && !url) {
      return new Response(
        JSON.stringify({ error: "Keyword or URL is required" }),
        { status: 400 }
      );
    }

    const payload = keyword ? { keyword } : { url };
    const targetEndpoint = keyword
      ? "http://localhost:5000/search"
      : "http://localhost:5000/check";

    console.log("🔁 Forwarding to Python:", payload);

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("✅ Response from Python:", data);

    const bucketName = process.env.BUCKET_NAME;
    const region = process.env.AWS_REGION;

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    const fileKey = data.fileUrl;
    const s3Key = `reports/${fileKey}`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 30000 });

    if (!fileKey) {
      return new Response(
        JSON.stringify(data),
        { status: 200 },
        { signedUrl: signedUrl }
      );
    }
    console.log("✅ Pre-signed download URL:", signedUrl);

    return new Response(JSON.stringify({ ...data, downloadUrl: signedUrl }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error in /api/send-keys:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
