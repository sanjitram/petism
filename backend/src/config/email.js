import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Debug logging
console.log("Email Config Check:", {
  user: process.env.EMAIL_USER ? "Set" : "Missing",
  pass: process.env.EMAIL_APP_PASSWORD ? "Set (Length: " + process.env.EMAIL_APP_PASSWORD.length + ")" : "Missing"
});

export const sendCreationEmail = async (to, note) => {
  const subject = `Petition Created: ${note.title}`;
  const emailText = `
    You've started a movement! 🚀
    
    Your petition "${note.title}" has been successfully created.
    
    Details:
    - Target Signatures: ${note.targetLikes}
    - Description: ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}
    
    Share your petition to gather support:
    ${process.env.FRONTEND_URL}/note/${note._id}
    
    Good luck!
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: emailText
    });
    console.log(`Creation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendLikesUpdateEmail = async (to, note) => {
  const isTargetReached = note.likes >= note.targetLikes;

  const subject = isTargetReached
    ? `🎉 VICTORY: Your petition "${note.title}" has reached its goal!`
    : `Petition Update: ${note.title}`;

  const emailText = isTargetReached
    ? `
    CONGRATULATIONS! 
    
    Your petition "${note.title}" has successfully reached its target of ${note.targetLikes} signatures!
    
    This is a huge milestone. Thank you for using PetISM to make a difference.
    
    Final Stats:
    - Total Signatures: ${note.likes}
    - Target: ${note.targetLikes}
    
    View your victory here: ${process.env.FRONTEND_URL}/note/${note._id}
    `
    : `
    Your petition "${note.title}" is gaining traction!
    
    Current Stats:
    - Current Signatures: ${note.likes}
    - Target: ${note.targetLikes}
    - Progress: ${Math.round((note.likes / note.targetLikes) * 100)}%
    
    View your petition: ${process.env.FRONTEND_URL}/note/${note._id}
    `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: emailText
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};