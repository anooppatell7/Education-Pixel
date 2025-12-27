
import React from 'react';
import type { ExamResult, ExamRegistration } from '@/lib/types';
import { format, parseISO } from 'date-fns';

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
  backgroundImageUrl: string;
}

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
      certContainer: {
        width: '1000px',
        height: '700px',
        position: 'relative',
        fontFamily: 'Roboto, sans-serif',
        color: '#000',
        backgroundImage: `url(${data.backgroundImageUrl})`,
        backgroundSize: '100% 100%',
      },
      // Header Content
      logo: { position: 'absolute', top: '55px', left: '60px', width: '90px', height: '90px', borderRadius: '50%'},
      mainTitle: { position: 'absolute', top: '48px', left: '180px', width: '640px', textAlign: 'center', fontFamily: "'Bree Serif', serif", color: '#d32f2f', fontSize: '40px', letterSpacing: '1px', textShadow: '1px 1px 0px #000', margin: 0, textTransform: 'uppercase'},
      tagline: { position: 'absolute', top: '90px', left: '180px', width: '640px', textAlign: 'center', fontFamily: "'Dancing Script', cursive", color: '#1a237e', fontSize: '24px', margin: 0},
      
      // Meta Info
      regNo: { position: 'absolute', top: '168px', left: '90px', fontSize: '12px', fontWeight: 'bold' },
      certNo: { position: 'absolute', top: '188px', left: '90px', fontSize: '12px', fontWeight: 'bold' },
      studentPhoto: { position: 'absolute', top: '158px', right: '70px', width: '100px', height: '125px', border: '2px solid #000', objectFit: 'cover' },

      // Main Text Content
      honorific: { position: 'absolute', top: '270px', left: '60px', fontSize: '16px' },
      studentName: { position: 'absolute', top: '268px', left: '380px', fontSize: '18px', fontWeight: 'bold', color: '#1a237e', textTransform: 'uppercase' },
      
      parentage: { position: 'absolute', top: '310px', left: '60px', fontSize: '16px' },
      parentName: { position: 'absolute', top: '308px', left: '290px', fontSize: '18px', fontWeight: 'bold', color: '#1a237e', textTransform: 'uppercase' },
      
      courseText: { position: 'absolute', top: '350px', left: '60px', fontSize: '16px' },
      courseName: { position: 'absolute', top: '348px', left: '370px', fontSize: '18px', fontWeight: 'bold', color: '#1a237e', textTransform: 'uppercase', width: '550px' },

      // Course Details Grid
      duration: { position: 'absolute', top: '405px', left: '90px', fontSize: '14px', fontWeight: 'bold', color: '#1a237e' },
      grade: { position: 'absolute', top: '405px', left: '450px', fontSize: '14px', fontWeight: 'bold', color: '#1a237e' },
      dob: { position: 'absolute', top: '405px', left: '760px', fontSize: '14px', fontWeight: 'bold', color: '#1a237e' },

      center: { position: 'absolute', top: '445px', left: '60px', fontSize: '16px', fontWeight: 'bold' },
      centerName: { position: 'absolute', top: '445px', left: '140px', fontSize: '16px', fontWeight: 'bold', color: '#1a237e', textTransform: 'uppercase' },

      // Date Section
      admissionDate: { position: 'absolute', top: '485px', left: '90px', fontSize: '14px', fontWeight: 'bold' },
      issueDate: { position: 'absolute', top: '485px', right: '90px', fontSize: '14px', fontWeight: 'bold' },

      // Footer
      qrCode: { position: 'absolute', top: '530px', left: '90px', width: '80px', height: '80px' },
      qrText: { position: 'absolute', top: '615px', left: '95px', fontSize: '10px', fontWeight: 'bold' },

      verifiedBySeal: { position: 'absolute', top: '525px', left: '465px', width: '70px'},
      verifiedByText: { position: 'absolute', top: '595px', left: '465px', width: '70px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1a237e'},

      authSigLine: { position: 'absolute', top: '590px', left: '730px', width: '160px', borderTop: '1px solid #000' },
      authSigText: { position: 'absolute', top: '595px', left: '730px', width: '160px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1a237e' },
      
    };

    return (
        <div style={styles.certContainer}>
            {/* Header */}
            <img src={data.logoUrl} alt="Logo" style={styles.logo} />
            <h1 style={styles.mainTitle}>EDUCATION PIXEL</h1>
            <p style={styles.tagline}>Learn focus & Grow</p>

            {/* Meta */}
            <p style={styles.regNo}><strong>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</strong></p>
            <p style={styles.certNo}><strong>Certificate No. : {data.certificateId}</strong></p>
            <img src={data.studentPhotoUrl} alt="Student" style={styles.studentPhoto} />

            {/* Content */}
            <p style={styles.honorific}>We are much pleased to honour Mr./Ms./Mrs :</p>
            <span style={styles.studentName}>{data.studentName}</span>
            
            <p style={styles.parentage}>Son/Daughter/Wife Mr. :</p>
            <span style={styles.parentName}>{data.registration.fatherName}</span>
            
            <p style={styles.courseText}>Has successfully completed a course of :</p>
            <span style={styles.courseName}>{data.courseName}</span>

            {/* Details Grid */}
            <p style={styles.duration}><strong>Course Duration :</strong> {data.registration.courseDuration}</p>
            <p style={styles.grade}><strong>Grade Awarded :</strong> {data.grade}</p>
            <p style={styles.dob}><strong>D.O.B.:</strong> {format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</p>

            <p style={styles.center}><strong>Center :</strong> <span style={styles.centerName}>EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</span></p>

            {/* Dates */}
            <p style={styles.admissionDate}><strong>Date of Admission:</strong> {format(new Date(data.registration.registeredAt.seconds * 1000), 'dd-MM-yyyy')}</p>
            <p style={styles.issueDate}><strong>Date of Issue:</strong> {format(new Date(data.issueDate), 'dd-MM-yyyy')}</p>

            {/* Footer */}
            {data.qrCodeUrl && <img src={data.qrCodeUrl} alt="QR" style={styles.qrCode} />}
            <p style={styles.qrText}>Scan to Verify</p>
            
            <img src={data.sealUrl} alt="Seal" style={styles.verifiedBySeal} />
            <p style={styles.verifiedByText}>Verified By :</p>

            <div style={styles.authSigLine}></div>
            <p style={styles.authSigText}>Authorised Signature</p>
        </div>
    );
}
