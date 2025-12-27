
'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { renderToStaticMarkup } from 'react-dom/server';
import CertificateTemplate from '@/components/certificate-template';
import type { ExamResult, ExamRegistration } from './types';
import { preloadImageAsBase64 } from './base64-preloader';
import QRCode from 'qrcode';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  registration: ExamRegistration;
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
  grade: string;
  logoUrl: string;
  studentPhotoUrl: string;
  sealUrl: string;
  partnerLogos: {
    gov: string;
    iso: string;
    msme: string;
    niti: string;
    startup: string;
  }
  qrCodeUrl?: string;
}

const CERT_WIDTH = 1000;
const CERT_HEIGHT = 700;

async function getCertificateImages(photoUrl: string, qrCodeDataUrl?: string) {
  // Removed all csspicker.dev links to prevent CORS errors.
  // Using placeholders or empty strings for now. These can be replaced with reliable, hosted image URLs.
  const imagePromises: Promise<string>[] = [
    preloadImageAsBase64("https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png"), // Main Logo
    preloadImageAsBase64(photoUrl).catch(() => "https://res.cloudinary.com/dqycipmr0/image/upload/v1718182510/placeholder-user_f38a5k.png"), // Student Photo
  ];

  if (qrCodeDataUrl) {
    imagePromises.push(Promise.resolve(qrCodeDataUrl));
  }

  const [logo, studentPhoto, qrCode] = await Promise.all(imagePromises);
  
  const placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent 1x1 pixel

  return { 
    logo, 
    studentPhoto, 
    // Using placeholders for previously failing images
    seal: placeholderImage, 
    partnerLogos: { 
        gov: placeholderImage, 
        iso: placeholderImage, 
        msme: placeholderImage, 
        niti: placeholderImage, 
        startup: placeholderImage 
    },
    qrCode 
  };
}

const getGrade = (percentage: number) => {
    if (percentage >= 75) return 'A';
    if (percentage >= 50) return 'B';
    if (percentage >= 30) return 'C';
    return 'D';
};


export async function generateCertificatePdf(data: CertificateData): Promise<Blob> {
  try {
    const siteUrl = window.location.origin;
    const verificationUrl = `${siteUrl}/verify-certificate?id=${data.certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H', width: 80 });

    const { logo, studentPhoto, seal, partnerLogos, qrCode } = await getCertificateImages(data.registration.photoUrl, qrCodeDataUrl);
    
    const grade = getGrade(data.percentage);

    const finalData = {
      ...data,
      grade,
      logoUrl: logo,
      studentPhotoUrl: studentPhoto,
      sealUrl: seal,
      partnerLogos,
      qrCodeUrl: qrCode,
    };
    
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = `${CERT_WIDTH}px`;
    container.style.height = `${CERT_HEIGHT}px`;
    document.body.appendChild(container);
    
    // We need to use ReactDOMServer to render the component to a string
    // This string is then put into the container div.
    const staticMarkup = renderToStaticMarkup(CertificateTemplate(finalData));
    container.innerHTML = staticMarkup;
    
    // Add a delay for fonts and images to potentially load
    await new Promise<void>((resolve) => {
      document.fonts.ready.then(() => {
        setTimeout(resolve, 1500); // Wait for images etc.
      });
    });

    const canvas = await html2canvas(container, {
      scale: 3, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff', // Set a white background
      imageTimeout: 0,
      width: CERT_WIDTH,
      height: CERT_HEIGHT,
      windowWidth: CERT_WIDTH,
      windowHeight: CERT_HEIGHT,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    document.body.removeChild(container);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [CERT_WIDTH, CERT_HEIGHT],
    });

    pdf.addImage(imgData, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT);
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
