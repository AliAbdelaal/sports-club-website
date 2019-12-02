const {sequelize,Trainer,Train,Session} = require("../connection");


function createTrainer(trainerData)
{
    sequelize.sync()
    .then(() => Trainer.create({
      name: trainerData.name,
      email: trainerData.email,
      password: trainerData.password,
      
  }))
    .then(trainer => {
       return trainer;
  })
  .catch(err =>{
    return err;
    
  });

    
}

function updateTrainer(trainerData)
{
    sequelize.sync()
    .then(() => User.update({
      name: trainerData.name,
      email: trainerData.email,
      password: trainerData.password,
      
  },{
    where:{
      id: trainerData.id
    }
  }))
    .then(trainer => {
        return trainer;
  }) 
  .catch(err =>{
    return err; 
  });
   
}
function showTrains(trainerId)
{
    sequelize.sync()
    .then(() => Train.findAll({
      where:{
        trainer_id: trainerId
      }
  }))
    .then(trains => {
        return trains;
  })
  .catch(err =>{
    return err;
    
  });
   
}
function showSessions(trainerId)
{
    sequelize.sync()
    .then(() => Session.findAll({
      where:{
        trainer_id: trainerId
      }
  }))
    .then(sessions => {
        return sessions;
  })
  .catch(err =>{
    return err;
    
  });
   
}
function deleteTrainer(trainerId)
{
    sequelize.sync()
    .then(() => Trainer.destroy({
      where:{
        id: trainerId
      }
  }))
    .then(trainer => {
        return trainer;
  })
  .catch(err =>{
    return err;
  });
   
}




module.exports = {
    createTrainer,
    updateTrainer,
    showSessions,
    showTrains,
    deleteTrainer
}
