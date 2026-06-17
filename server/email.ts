import nodemailer from 'nodemailer';
import type { 
  BusinessProfile, 
  JobPosition, 
  TalentProfile, 
  RecruitmentPipeline 
} from '@shared/schema';

// Email configuration (Microsoft 365)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });
};

export class EmailService {
  private transporter: nodemailer.Transporter;
  private adminEmail: string;

  constructor() {
    this.transporter = createTransporter();
    this.adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '';
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('Email credentials not configured. Email would be sent:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html}`);
        return;
      }

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async notifyNewTalentProfile(talent: TalentProfile) {
    const subject = `New Talent Profile: ${talent.name}`;
    const html = `
      <h2>New Talent Profile Submitted</h2>
      <p><strong>Name:</strong> ${talent.name}</p>
      <p><strong>Email:</strong> ${talent.email}</p>
      <p><strong>Experience:</strong> ${talent.experience} years</p>
      <p><strong>Location:</strong> ${talent.location}</p>
      <p><strong>Skills:</strong> ${talent.skills?.join(', ') || 'Not specified'}</p>
      <p><strong>Availability:</strong> ${talent.availability}</p>
      ${talent.portfolio ? `<p><strong>Portfolio:</strong> <a href="${talent.portfolio}">${talent.portfolio}</a></p>` : ''}
      ${talent.education ? `<p><strong>Education:</strong> ${talent.education}</p>` : ''}
    `;

    await this.sendEmail(this.adminEmail, subject, html);
  }

  async notifyNewJobPosition(job: JobPosition, business: BusinessProfile) {
    const subject = `New Job Position: ${job.title} at ${business.companyName}`;
    const html = `
      <h2>New Job Position Posted</h2>
      <p><strong>Position:</strong> ${job.title}</p>
      <p><strong>Company:</strong> ${business.companyName}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Experience Level:</strong> ${job.experienceLevel}</p>
      ${job.salaryRange ? `<p><strong>Salary Range:</strong> ${job.salaryRange}</p>` : ''}
      ${job.description ? `<p><strong>Description:</strong> ${job.description}</p>` : ''}
      <p><strong>Required Skills:</strong> ${job.skills?.join(', ') || 'Not specified'}</p>
      <p><strong>Requirements:</strong> ${job.requirements?.join(', ') || 'Not specified'}</p>
    `;

    await this.sendEmail(this.adminEmail, subject, html);
  }

  async notifyPipelineStatusChange(
    pipeline: RecruitmentPipeline, 
    talent: TalentProfile, 
    job: JobPosition, 
    business: BusinessProfile,
    oldStage?: string
  ) {
    const stageChanged = oldStage && oldStage !== pipeline.stage;
    const subject = stageChanged 
      ? `Pipeline Update: ${talent.name} moved to ${pipeline.stage} for ${job.title}`
      : `New Application: ${talent.name} applied for ${job.title}`;
    
    const html = `
      <h2>${stageChanged ? 'Recruitment Pipeline Update' : 'New Job Application'}</h2>
      <p><strong>Candidate:</strong> ${talent.name} (${talent.email})</p>
      <p><strong>Position:</strong> ${job.title}</p>
      <p><strong>Company:</strong> ${business.companyName}</p>
      ${stageChanged ? `<p><strong>Previous Stage:</strong> ${oldStage}</p>` : ''}
      <p><strong>Current Stage:</strong> ${pipeline.stage}</p>
      <p><strong>Status:</strong> ${pipeline.status}</p>
      ${pipeline.notes ? `<p><strong>Notes:</strong> ${pipeline.notes}</p>` : ''}
      ${pipeline.scheduledDate ? `<p><strong>Scheduled Date:</strong> ${pipeline.scheduledDate}</p>` : ''}
    `;

    await this.sendEmail(this.adminEmail, subject, html);
  }

  async notifyBusinessProfileCreated(business: BusinessProfile) {
    const subject = `New Business Profile: ${business.companyName}`;
    const html = `
      <h2>New Business Profile Created</h2>
      <p><strong>Company:</strong> ${business.companyName}</p>
      <p><strong>Industry:</strong> ${business.industry}</p>
      <p><strong>Location:</strong> ${business.location}</p>
      <p><strong>Team Size:</strong> ${business.teamSize}</p>
      <p><strong>Budget:</strong> $${business.budget.toLocaleString()}</p>
      ${business.description ? `<p><strong>Description:</strong> ${business.description}</p>` : ''}
      <p><strong>Requirements:</strong> ${business.requirements?.join(', ') || 'Not specified'}</p>
    `;

    await this.sendEmail(this.adminEmail, subject, html);
  }
}

export const emailService = new EmailService();