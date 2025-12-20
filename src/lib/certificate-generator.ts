
'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { renderToStaticMarkup } from 'react-dom/server';
import CertificateTemplate from '@/components/certificate-template';
import type { ExamResult } from './types';
import { preloadImageAsBase64 } from './base64-preloader';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
}

// A4 landscape pixel size for html2canvas at 96 DPI
const A4_WIDTH = 1123;
const A4_HEIGHT = 794;

async function getCertificateImages() {
  const [logo, goldSeal, signature] = await Promise.all([
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766205812/Gemini_Generated_Image_8z1csh8z1csh8z1c-removebg-preview_hir77o.png"),
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766205295/ashish-kumar-stalemate_h5zzej.png"),
  ]);

  return { logo, goldSeal, signature };
}

export async function generateCertificatePdf(data: CertificateData): Promise<Blob> {
  try {
    const { logo, goldSeal, signature } = await getCertificateImages();
    
    // The logo is used for both the main logo and the watermark
    const finalData = {
      ...data,
      logoUrl: logo,
      watermarkUrl: logo, // Use the EP logo as the watermark
      goldSealUrl: goldSeal,
      signatureUrl: signature,
    };
    
    // Create an off-screen container for rendering
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = `${A4_WIDTH}px`;
    container.style.height = `${A4_HEIGHT}px`;
    container.style.zIndex = "-9999"; // Hide it
    container.style.fontFamily = '"Playfair Display", serif';
    document.body.appendChild(container);
    
    // Render the React component to an HTML string
    const staticMarkup = renderToStaticMarkup(CertificateTemplate(finalData));
    container.innerHTML = staticMarkup;
    
    // Add a small delay and check for font loading to ensure fonts and images are loaded
    await new Promise<void>((resolve) => {
      // Use document.fonts.ready to wait for all fonts to be loaded
      document.fonts.ready.then(() => {
        // Even after fonts are ready, give a small buffer for rendering
        setTimeout(resolve, 500); 
      });
    });

    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // For higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Transparent background
      imageTimeout: 0,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Clean up the off-screen container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [A4_WIDTH, A4_HEIGHT],
    });

    pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH, A4_HEIGHT);
    const blob = pdf.output("blob");

    if (!blob || blob.size < 5000) {
      console.error("Generated PDF is too small or invalid:", blob.size);
      throw new Error("EMPTY_PDF_GENERATED");
    }

    return blob;
  } catch (err) {
    console.error("PDF_GENERATION_FAILED:", err);
    throw err; // Re-throw the original error
  }
}
