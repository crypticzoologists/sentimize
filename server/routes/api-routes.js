var UserController = require('./../controllers/UserController.js');
var SessionController = require('./../controllers/SessionController.js');
var SnapshotController = require('./../controllers/SnapshotController.js');
var emailController = require('./../controllers/emailController.js');
module.exports = function(app) {
  // See auth-routes for POST to /api/users
  app.get('/api/users', UserController.getCurrentUser);
  app.put('/api/users', UserController.updateUser);
  app.get('/api/users/getCalledUser', UserController.getCalledUser);
  app.post('/api/users/updatePeerId', UserController.updatePeerId);
  app.get('/api/usernames', UserController.getUserNames);

  app.get('/api/session/interviewer',  SessionController.getInterviewerSessions);
  app.get('/api/session/interviewee',  SessionController.getIntervieweeSessions);
  app.post('/api/session', SessionController.createSession);
  app.post('/api/session/update', SessionController.updateSession);
  app.get('/api/session/calledGenerateSession',  SessionController.calledGenerateSession);
  app.get('/api/sessionInfo', SessionController.sessionInfo);
  app.post('/api/transcript', SessionController.sessionTranscript);
  app.get('/api/transcript/*', SessionController.loadSessionTranscript);
  app.post('/api/notes', SessionController.sessionNotes);
  app.get('/api/notes/*', SessionController.loadSessionNotes);
  

  app.get('/api/snapshot', SnapshotController.getSnapshots);
  app.post('/api/snapshot', SnapshotController.createSnapshot);

  app.post('/emailnotes', emailController.sendEmail);
};