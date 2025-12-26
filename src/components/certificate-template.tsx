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
  certificateImageUrl: string;
  qrCodeUrl?: string; // QR code is now optional and passed as a data URL
}

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '1123px',
            height: '794px',
            boxSizing: 'border-box',
            fontFamily: '"Calibri", "Arial", sans-serif',
            color: '#000',
            position: 'relative',
            backgroundColor: '#fff',
            overflow: 'hidden',
        },
        border: {
            position: 'absolute',
            top: '25px',
            left: '25px',
            right: '25px',
            bottom: '25px',
            border: '2px solid #b08c54',
            zIndex: 1,
        },
        corner: {
            position: 'absolute',
            width: '250px',
            height: '250px',
            zIndex: 2,
        },
        cornerInner: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
        },
        cTopLeft: { top: 0, left: 0 },
        cTopRight: { top: 0, right: 0, transform: 'rotate(90deg)' },
        cBottomLeft: { bottom: 0, left: 0, transform: 'rotate(-90deg)' },
        cBottomRight: { bottom: 0, right: 0, transform: 'rotate(180deg)' },
        cInnerMaroon: { background: '#c00000', clipPath: 'polygon(0 0, 100% 0, 0 100%)' },
        cInnerGold: { background: '#b08c54', clipPath: 'polygon(0 0, 65% 0, 0 65%)' },

        backgroundWatermark: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.08,
            width: '400px',
            height: 'auto',
            zIndex: 0,
        },
        content: {
            position: 'relative',
            zIndex: 3,
            padding: '40px 60px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
        header: {
            display: 'flex', alignItems: 'center', gap: '20px',
        },
        logo: { width: '100px', height: '100px', border: '3px solid #000', borderRadius: '50%' },
        instituteDetails: {
            textAlign: 'center', color: '#c00000', flexGrow: 1, padding: '0 20px'
        },
        instituteName: { fontSize: '48px', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', letterSpacing: '2px', lineHeight: 1 },
        tagline: { fontSize: '24px', fontWeight: 'bold', fontFamily: '"Brush Script MT", cursive', margin: '5px 0', color: '#0070c0' },

        regAndPhotoSection: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '15px'
        },
        regDetails: { fontSize: '15px', fontWeight: 'bold', lineHeight: 1.8, color: '#000' },
        studentPhoto: { width: '100px', height: '120px', border: '3px solid #000', objectFit: 'cover' },
        
        mainBody: {
            textAlign: 'center',
            marginTop: '0px',
            flexGrow: 1,
        },
        certificateImage: {
             width: '180px',
             height: 'auto',
             margin: '0 auto',
             marginTop: '-15px'
        },
        
        studentInfo: {
            textAlign: 'left', fontSize: '16px', lineHeight: 1.4,
            width: '100%',
            marginTop: '0px',
            fontFamily: '"Times New Roman", serif'
        },
        detailRow: {
            display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px',
            fontSize: '15px', fontWeight: 'bold'
        },

        footerSection: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            width: '100%', padding: '0',
            marginTop: 'auto',
        },
        signatureBlock: {
            textAlign: 'center', width: '200px', fontSize: '14px', fontWeight: 'bold' 
        },
        signatureLine: {
            borderBottom: '1px solid black', paddingBottom: '30px', marginBottom: '5px' 
        },
        qrCodeBlock: {
            textAlign: 'center',
            width: '100px',
        },
        qrImage: {
            width: '80px',
            height: '80px',
            margin: '0 auto 5px',
        },
        qrText: {
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: '"Courier New", monospace'
        },
        
        gradingBar: {
            backgroundColor: '#c00000', color: 'white', fontSize: '11px', fontWeight: 'bold',
            textAlign: 'center', padding: '3px', width: '100%', marginTop: '10px'
        },
        
        footerBar: {
            position: 'absolute', bottom: '35px', left: '60px', right: '60px',
            textAlign: 'center',
            fontSize: '11px',
        },
    };
    
    const admissionDate = data.registration.registeredAt?.toDate ? format(data.registration.registeredAt.toDate(), 'dd-MM-yyyy') : format(new Date(data.examDate), 'dd-MM-yyyy');

    return (
        <div style={styles.page}>
            <div style={styles.border}></div>
            <div style={{...styles.corner, ...styles.cTopLeft}}><div style={{...styles.cornerInner, ...styles.cInnerMaroon}}></div><div style={{...styles.cornerInner, ...styles.cInnerGold}}></div></div>
            <div style={{...styles.corner, ...styles.cTopRight}}><div style={{...styles.cornerInner, ...styles.cInnerMaroon}}></div><div style={{...styles.cornerInner, ...styles.cInnerGold}}></div></div>
            <div style={{...styles.corner, ...styles.cBottomLeft}}><div style={{...styles.cornerInner, ...styles.cInnerMaroon}}></div><div style={{...styles.cornerInner, ...styles.cInnerGold}}></div></div>
            <div style={{...styles.corner, ...styles.cBottomRight}}><div style={{...styles.cornerInner, ...styles.cInnerMaroon}}></div><div style={{...styles.cornerInner, ...styles.cInnerGold}}></div></div>

            <img style={styles.backgroundWatermark} src={data.logoUrl} alt="Watermark"/>

            <div style={styles.content}>
                <div style={styles.header}>
                    <img src={data.logoUrl} style={styles.logo} alt="Institute Logo" />
                    <div style={styles.instituteDetails}>
                        <h1 style={styles.instituteName}>EDUCATION PIXEL</h1>
                        <p style={styles.tagline}>Learn focus & Grow</p>
                    </div>
                </div>

                <div style={styles.regAndPhotoSection}>
                    <div style={styles.regDetails}>
                        <p>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</p>
                        <p>Certificate No. : {data.certificateId}</p>
                    </div>
                    <img src={data.studentPhotoUrl} style={styles.studentPhoto} alt="Student" />
                </div>

                <div style={styles.mainBody}>
                     <img 
                        src={data.certificateImageUrl}
                        style={styles.certificateImage} 
                        alt="Certificate Emblem" 
                    />
                    <div style={styles.studentInfo}>
                        <p>We are much pleased to honour Mr./Ms./Mrs : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.studentName}</span></p>
                        <p>Son/Daughter/Wife Mr. : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.registration.fatherName}</span></p>
                        <p>Has successfully completed a course of : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.courseName.toUpperCase()}</span></p>
                        
                        <div style={styles.detailRow}>
                            <span>Course Duration : {data.registration.courseDuration}</span>
                            <span>Grade Awarded : {data.grade}</span>
                            <span>D.O.B. : {format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</span>
                        </div>
                        
                        <p style={{marginTop: '5px', fontWeight: 'bold'}}>Center : EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</p>

                        <div style={styles.detailRow}>
                            <span>Date of Admission: {admissionDate}</span>
                            <span>Date of Issue: {format(new Date(data.issueDate), 'dd-MM-yyyy')}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.footerSection}>
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}>
                        </div>
                        <p style={{margin: 0}}>Verified By</p>
                    </div>
                    {data.qrCodeUrl && (
                        <div style={styles.qrCodeBlock}>
                            <img src={data.qrCodeUrl} style={styles.qrImage} alt="QR Code" />
                            <p style={styles.qrText}>Scan to Verify</p>
                        </div>
                    )}
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}>
                        </div>
                        <p style={{margin: 0}}>Authorised Signature</p>
                    </div>
                </div>

                <div style={styles.gradingBar}>
                    Assessment Grading: A-Excellent (75% Above), B-Good (60%-74%), C-Satisfactory (50%-59%), D-Unsatisfactory
                </div>
                
                 <div style={styles.footerBar}>
                     Regional Office : Bawali Mode, House Number 421 Year, Ward No 15, Near S.S. Dairy, Behror, Alwar, Rajasthan, India, 301701
                     <br />
                     www.educationpixel.com | info@educationpixel.com
                 </div>
            </div>
        </div>
    );
}
