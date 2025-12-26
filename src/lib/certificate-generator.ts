
'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { renderToStaticMarkup } from 'react-dom/server';
import CertificateTemplate from '@/components/certificate-template';
import type { ExamResult, ExamRegistration } from './types';
import { preloadImageAsBase64 } from './base64-preloader';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  registration: ExamRegistration;
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
}

const A4_WIDTH = 1123;
const A4_HEIGHT = 794;

async function getCertificateImages(photoUrl: string) {
  const [logo, studentPhoto, certificateImage, verifiedStamp, signature] = await Promise.all([
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png"),
    preloadImageAsBase64(photoUrl).catch(() => "https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/placeholder-user_f38a5k.png"), // Fallback if photo fails
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766732021/certificate_xtyqd5.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766897931/verified-stamp_l6v8ay.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766898144/auth-sign_tnywjp.png"),
  ]);

  return { logo, studentPhoto, certificateImage, verifiedStamp, signature };
}

const getGrade = (percentage: number) => {
    if (percentage >= 75) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
};


export async function generateCertificatePdf(data: CertificateData): Promise<Blob> {
  try {
    const { logo, studentPhoto, certificateImage, verifiedStamp, signature } = await getCertificateImages(data.registration.photoUrl);
    
    const grade = getGrade(data.percentage);

    const finalData = {
      ...data,
      grade,
      logoUrl: logo,
      studentPhotoUrl: studentPhoto,
      certificateImageUrl: certificateImage,
      verifiedStampUrl: verifiedStamp,
      signatureUrl: signature,
    };
    
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = `${A4_WIDTH}px`;
    container.style.height = `${A4_HEIGHT}px`;
    document.body.appendChild(container);
    
    const staticMarkup = renderToStaticMarkup(CertificateTemplate(finalData));
    container.innerHTML = staticMarkup;
    
    // Wait for fonts and images to load
    await new Promise<void>((resolve) => {
      document.fonts.ready.then(() => {
        setTimeout(resolve, 1000); // Increased timeout for better rendering
      });
    });

    const canvas = await html2canvas(container, {
      scale: 3, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      imageTimeout: 0,
      width: A4_WIDTH,
      height: A4_HEIGHT,
      windowWidth: A4_WIDTH,
      windowHeight: A4_HEIGHT,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    document.body.removeChild(container);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [A4_WIDTH, A4_HEIGHT],
    });

    pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH, A4_HEIGHT);
    const blob = pdf.output("blob");

    if (!blob || blob.size < 5000) {
      throw new Error("EMPTY_PDF_GENERATED");
    }

    return blob;
  } catch (err) {
    console.error("PDF_GENERATION_FAILED:", err);
    throw err;
  }
}
