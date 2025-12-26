
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
  const [logo, certBanner, qr, footerLogos, studentPhoto] = await Promise.all([
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/cert-banner_yjy2f7.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/qr-code_yp1vln.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/footer-logos-new_l1iizj.png"),
    preloadImageAsBase64(photoUrl).catch(() => "https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/placeholder-user_f38a5k.png"), // Fallback if photo fails
  ]);

  return { logo, certBanner, qr, footerLogos, studentPhoto };
}

const getGrade = (percentage: number) => {
    if (percentage >= 75) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
};


export async function generateCertificatePdf(data: CertificateData): Promise<Blob> {
  try {
    const { logo, certBanner, qr, footerLogos, studentPhoto } = await getCertificateImages(data.registration.photoUrl);
    
    const grade = getGrade(data.percentage);

    const finalData = {
      ...data,
      grade,
      logoUrl: logo,
      certBannerUrl: certBanner,
      qrUrl: qr,
      footerLogosUrl: footerLogos,
      studentPhotoUrl: studentPhoto,
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
