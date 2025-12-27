

import React from 'react';
import type { CertificateData } from '@/lib/types';
import { format, parseISO } from 'date-fns';

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
      certContainer: {
        width: '1000px',
        height: '700px',
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
        color: '#000',
        backgroundImage: `url(${data.backgroundImageUrl})`,
        backgroundSize: '100% 100%',
        boxSizing: 'border-box'
      },
      logo: { position: 'absolute', top: '55px', left: '60px', width: '90px', height: '90px', borderRadius: '50%'},
      
      mainTitle: { position: 'absolute', top: '48px', left: '180px', width: '640px', textAlign: 'center', fontFamily: "'Times New Roman', serif", color: '#d32f2f', fontSize: '40px', letterSpacing: '1px', fontWeight: 'bold' },
      tagline: { position: 'absolute', top: '90px', left: '180px', width: '640px', textAlign: 'center', fontFamily: "'Dancing Script', cursive", color: '#1a237e', fontSize: '24px', margin: 0},
      
      regNo: { position: 'absolute', top: '168px', left: '90px', fontSize: '14px', fontWeight: 'bold' },
      certNo: { position: 'absolute', top: '188px', left: '90px', fontSize: '14px', fontWeight: 'bold' },
      
      studentPhoto: { position: 'absolute', top: '158px', right: '80px', width: '100px', height: '125px', border: '2px solid #000', objectFit: 'cover' },

      lineText: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px'
      },
      
      highlight: {
        color: '#1a237e',
        fontSize: '18px',
        fontWeight: 'bold',
        paddingLeft: '10px'
      },
      
      mainContent: {
        position: 'absolute',
        top: '260px',
        left: '90px',
        width: '820px'
      },

      courseDetailsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        marginBottom: '15px',
        fontSize: '15px',
        fontWeight: 'bold'
      },
      
      dateRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        fontSize: '15px',
        fontWeight: 'bold'
      },
      
      qrCode: { position: 'absolute', top: '530px', left: '90px', width: '80px', height: '80px' },
      qrText: { position: 'absolute', top: '615px', left: '95px', fontSize: '10px', fontWeight: 'bold' },
      
      verifiedBy: { position: 'absolute', top: '595px', left: '465px', width: '70px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1a237e'},

      authSigLine: { position: 'absolute', top: '590px', left: '730px', width: '160px', borderTop: '1px solid #000' },
      authSigText: { position: 'absolute', top: '595px', left: '730px', width: '160px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1a237e' },
      
    };

    return (
        <div style={styles.certContainer}>
            <img src={data.logoUrl} alt="Logo" style={styles.logo} />
            <h1 style={styles.mainTitle}>EDUCATION PIXEL</h1>
            <p style={styles.tagline}>Learn focus & Grow</p>

            <div style={styles.regNo}><strong>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> {data.registration.registrationNumber}</div>
            <div style={styles.certNo}><strong>Certificate No. :</strong> {data.certificateId}</div>
            
            <img src={data.studentPhotoUrl} alt="Student" style={styles.studentPhoto} />

            <div style={styles.mainContent}>
              <p style={styles.lineText}>We are much pleased to honour Mr./Ms./Mrs :<span style={styles.highlight}>{data.studentName}</span></p>
              <p style={styles.lineText}>Son/Daughter/Wife Mr. :<span style={styles.highlight}>{data.registration.fatherName}</span></p>
              <p style={styles.lineText}>Has successfully completed a course of :<span style={styles.highlight}>{data.courseName}</span></p>

              <div style={styles.courseDetailsRow}>
                  <span><strong>Course Duration :</strong> {data.registration.courseDuration}</span>
                  <span><strong>Grade Awarded :</strong> {data.grade}</span>
                  <span><strong>D.O.B.:</strong> {format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</span>
              </div>
              
              <p style={styles.lineText}><strong>Center :</strong><span style={styles.highlight}>EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</span></p>
              
              <div style={styles.dateRow}>
                  <span><strong>Date of Admission:</strong> {format(new Date(data.registration.registeredAt.seconds * 1000), 'dd-MM-yyyy')}</span>
                  <span><strong>Date of Issue:</strong> {format(new Date(data.issueDate), 'dd-MM-yyyy')}</span>
              </div>
            </div>

            {data.qrCodeUrl && <img src={data.qrCodeUrl} alt="QR" style={styles.qrCode} />}
            <p style={styles.qrText}>Scan to Verify</p>
            
            <p style={styles.verifiedBy}>Verified By :</p>

            <div style={styles.authSigLine}></div>
            <p style={styles.authSigText}>Authorised Signature</p>
        </div>
    );
}
