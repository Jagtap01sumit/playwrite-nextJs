import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
import { tmpdir } from "os";

const streamPipeline = promisify(pipeline);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new Response(JSON.stringify({ error: "Missing file name" }), {
      status: 400,
    });
  }

  const bucketName = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const key = `reports/${fileName}`;
  const localFilePath = path.join(tmpdir(), fileName); // or use "./downloads" folder

  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const { Body } = await s3.send(command);

    const writeStream = createWriteStream(localFilePath);
    await streamPipeline(Body, writeStream);

    console.log(`✅ Report saved locally at: ${localFilePath}`);
    return new Response(
      JSON.stringify({ message: "File downloaded", path: localFilePath })
    );
  } catch (err) {
    console.error("❌ Error downloading file from S3:", err);
    return new Response(JSON.stringify({ error: "Download failed" }), {
      status: 500,
    });
  }
}
