var Session = require('../models/SessionModel.js');
var moment = require('moment');
var fs = require('fs');
var User = require('./../models/UserModel.js');

module.exports = {
  createSession: function(req, res) {
    // Dummy data for now in: title, description, subject, and duration
    console.log(req.data, 'REQ DATA')
    console.log(req.body, 'REQ BODY')
    var sessionObj = {
      intervieweeId: req.body.intervieweeId,
      interviewerId: req.body.interviewerId,
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      date: moment().format('MMMM Do YYYY, h:mm a'),
      duration: 'Temporary Duration'
    };

    return new Session(sessionObj).save()
      .then(function(newSession) {
        res.status(201).send(newSession);
      })
      .catch(function(err) {
       console.log(err);
      });
  },

  getInterviewerSessions: function(req, res) {
    Session.where({ interviewerId: req.user.id }).where('duration', '<>', 'Temporary Duration').fetchAll()
      .then(function(sessions) {
        res.status(200).send(sessions);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  getIntervieweeSessions: function(req, res) {
    Session.where({ intervieweeId: req.user.id }).where('duration', '<>', 'Temporary Duration').fetchAll()
      .then(function(sessions) {
        res.status(200).send(sessions);
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  updateSession: function(req, res) {
    return Session.forge({id: req.body.sessionId})
      .fetch()
      .then(function(session) {
        session.save({
          duration: req.body.difference
        });
      })
      .then(function(updatedSession) {
        res.status(201).send(updatedSession)
      })
      .catch(function(err) {
        console.log('Error in updating session', err)
      });
  },

  calledGenerateSession: function(req, res) {
    Session.where({ intervieweeId: req.query.id }).fetchAll()
      .then(function(intervieweeSessions) {
        Session.where({ interviewerId: req.query.id }).fetchAll()
          .then(function(interviewerSessions) {
            var blank = { attributes: { id: 0 } }
            var lastInterviewerSession = interviewerSessions._byId[Object.keys(interviewerSessions._byId)[(Object.keys(interviewerSessions._byId).length) / 2 - 1]] || blank;
            var lastIntervieweeSession = intervieweeSessions._byId[Object.keys(intervieweeSessions._byId)[(Object.keys(intervieweeSessions._byId).length) / 2 - 1]] || blank;
            console.log('INTERVIEWER', lastInterviewerSession);
            console.log('interviewee', lastIntervieweeSession);
            if (lastInterviewerSession.attributes.id > lastIntervieweeSession.attributes.id) {
              res.status(200).send(lastInterviewerSession);
            } else {
              res.status(200).send(lastIntervieweeSession);
            }
            res.send();
          })
      })
      .catch(function(err) {
        console.error(err);
      });
  },
  

  sessionTranscript: function(req, res) {
    new Session({
      'id' : req.body.session
    }).save({
      'transcript': req.body.transcript
    }).then(function(session){
      res.status(200).send(session);
    })
    .catch(function(err) {
      console.error(err);
    })
  },
  
  loadSessionTranscript: function(req, res) {
    var parsedUrl = req.url.split('/');
    var queryObj = {
      id: parsedUrl[parsedUrl.length - 1]
    }
    Session.where(queryObj).fetch()
    .then(function(session) {
      res.status(200).send(session.attributes.transcript);
    })
    .catch(function(err) {
      console.error(err);
    })
  },

  sessionInfo : function(req, res) {
    var queryObj = {
      id: req.query.sessionId
    }
    Session.where(queryObj).fetch()
    .then(function(session) {
      console.log(session.attributes);
      res.send(200, JSON.stringify({
        interviewee: session.attributes.intervieweeId,
        interviewer: session.attributes.interviewerId
      }));
    }).catch(function(err) {
        console.error(err);
    })
  },

  sessionNotes: function(req, res) {
    var notes = req.body.notes;
    var session = req.body.session;
    fs.writeFile(__dirname + "/../notes/" + session, notes, function(err) {
      if(err) {
        return console.error(err);
      }

      console.log("The file was saved!");
      res.send(200, "The file was saved!");
    });
  },

  loadSessionNotes: function(req, res) {
    var parsedUrl = req.url.split('/');
    var endPoint = parsedUrl[parsedUrl.length - 1];
    console.log('_______-______-',  + endPoint);
    fs.readFile(__dirname + "/../notes/" + endPoint, 'utf8', function(err, data){
      if(err) {
        return console.error(err);
      }
      console.log('WOWOWOWOW',data)
      res.status(201).send(data)
    })
  }
}
