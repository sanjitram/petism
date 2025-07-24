import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const sendLikesUpdateEmail = async (to, note) => {
  const emailText = `
    Your petition "${note.title}" has been updated!
    
    Current Stats:
    - Current Likes: ${note.likes}
    - Target Likes: ${note.targetLikes}
    - Progress: ${Math.round((note.likes / note.targetLikes) * 100)}%
    
    ${note.isSuccessful ? '🎉 Congratulations! Your petition has reached its goal!' : ''}
    
    View your petition: ${process.env.FRONTEND_URL}/note/${note._id}
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Petition Update: ${note.title}`,
      text: emailText
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};