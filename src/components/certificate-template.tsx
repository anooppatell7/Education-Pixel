

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
      headerLogo: {
        position: 'absolute',
        top: '40px',
        left: '130px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      },
      logo: {
        width: '110px',
        height: '110px',
        objectFit: 'contain'
      },
      mainTitle: {
        position: 'absolute',
        top: '40px',
        right: '50px',
        fontFamily: "'Poppins', sans-serif",
        color: '#d32f2f',
        fontSize: '77px',
        letterSpacing: '1px',
        fontWeight: 'bold',
        margin: '0',
        padding: '0',
        lineHeight: '1',
        whiteSpace: 'nowrap'
      },
      
      certificateBadge: { position: 'absolute', top: '125px', left: '50%', transform: 'translateX(-50%)', width: '200px' },

      regNo: { position: 'absolute', top: '180px', left: '80px', fontSize: '14px', fontWeight: 'bold' },
      certNo: { position: 'absolute', top: '200px', left: '80px', fontSize: '14px', fontWeight: 'bold' },
      
      studentPhoto: { position: 'absolute', top: '170px', right: '70px', width: '100px', height: '125px', border: '2px solid #000', objectFit: 'cover' },

      lineText: {
        fontSize: '17px',
        fontWeight: 'normal',
        marginBottom: '10px',
        color: '#333'
      },
      
      highlight: {
        color: '#1a237e',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '0 8px',
        fontFamily: "'Times New Roman', serif"
      },
      
      mainContent: {
        position: 'absolute',
        top: '250px',
        left: '80px',
        width: '840px'
      },
      
      courseDetailsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        marginBottom: '15px',
        fontSize: '16px',
        fontWeight: 'bold'
      },
      
      dateRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        fontSize: '16px',
        fontWeight: 'bold'
      },
      
      qrCode: { position: 'absolute', bottom: '90px', left: '90px', width: '100px', height: '100px' },
      qrText: { position: 'absolute', bottom: '75px', left: '105px', fontSize: '10px', fontWeight: 'bold' },
      
      authSigLine: { position: 'absolute', bottom: '115px', right: '80px', width: '160px', borderTop: '1px solid #000' },
      authSigText: { position: 'absolute', bottom: '90px', right: '80px', width: '160px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#1a237e' },

      gradingBar: {
        position: 'absolute',
        bottom: '180px',
        right: '80px',
        backgroundColor: '#d32f2f',
        color: 'white',
        fontSize: '12px',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap'
      },
      
      footerCombinedLogo: {
        position: 'absolute',
        bottom: '110px',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '50px',
        objectFit: 'contain'
      },
      footerAddress: {
        position: 'absolute',
        bottom: '85px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '12px',
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      },
      footerContact: {
        position: 'absolute',
        bottom: '65px',
        left: '0',
        right: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '12px',
        color: '#333'
      }
    };

    return (
        <div style={styles.certContainer}>
            <div style={styles.headerLogo}>
              <img src={data.logoUrl} alt="Logo" style={styles.logo} />
            </div>
             <h1 style={styles.mainTitle}>EDUCATION PIXEL</h1>

            <img src={data.certificateBadgeUrl} alt="Certificate Badge" style={styles.certificateBadge} />

            <div style={styles.regNo}><strong>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> {data.registration.registrationNumber}</div>
            <div style={styles.certNo}><strong>Certificate No. :</strong> {data.certificateId}</div>
            
            <img src={data.studentPhotoUrl} alt="Student" style={styles.studentPhoto} />

            <div style={styles.mainContent}>
              <p style={{...styles.lineText, marginBottom: '10px'}}>We are much pleased to honour Mr./Ms./Mrs :<span style={styles.highlight}>{data.studentName}</span></p>
              <p style={{...styles.lineText, marginBottom: '10px'}}>Son/Daughter/Wife Mr. :<span style={styles.highlight}>{data.registration.fatherName}</span></p>
              <p style={{...styles.lineText, marginBottom: '10px'}}>Has successfully completed a course of :<span style={styles.highlight}>{data.courseName}</span></p>

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
            
            <div style={styles.authSigLine}></div>
            <p style={styles.authSigText}>Authorised Signature</p>

            <div style={styles.gradingBar}>
                Assessment Grading: A-Excellent (75% Above), B-Good (75%-50%), C-Satisfactory (50%-30%), D-Below
            </div>

            <img src={data.combinedFooterLogoUrl} alt="Footer Logos" style={styles.footerCombinedLogo} />

            <div style={styles.footerAddress}>
                <span><strong>Add:</strong> MTS COMPUTER INSTITUTE Churri Chauraha Raniganj road pratapgarh</span>
                <span style={{display: 'block'}}>uttar pradesh, 229410</span>
            </div>

            <div style={styles.footerContact}>
                <span style={{ marginRight: '20px' }}>📧 ashishkumargiri51@gmail.com</span>
                <span>🌐 www.educationpixel.site</span>
            </div>
        </div>
    );
}
