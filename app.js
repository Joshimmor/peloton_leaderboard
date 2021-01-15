var healthKitStore = new HKHealthStore();
//User Class to be init when a User Regi
class user{
    constuctor(name, age ,weight,sex){
        this.name = name;
        this.age = age;
        this.weight = weight;
        this.sex = sex;
        this.workouts = [];
        this.currentWorkout = null; 
    } 
    FinishWorkout(workoutClass){
        this.currentWorkout.workout.inProgress = false;
        this.currentWorkout.workout.bPM = this.currentWorkout.workout.getBPM(healthKitStore);
        this.currentWorkout.workout.leaderboaderValue = this.currentWorkout.workout.leaderboardScore();
        this.currentWorkout.workout.       
        this.workouts.push(this.currentWorkout);
        this.currentWorkout = null;
    }
    startWorkout(workoutClass){
        let id = this.workouts.length() + 1;
        let workout = new workout(workoutClass,this.sex,this.age,this.weight);
        this.currentWorkout = {
            workout : workout,
            workoutID: id
        }
    }
}
//WorkoutClass Class to be init when a new workout is published for the users
//server side model 
class workoutClass {
    constructor(classID,duration,instructor,workoutName){
        this.classID = classID;
        this.duration = duration;
        this.instructor = instructor;
        this.workoutName = workoutName;
        this.workoutLeaderboard = new leaderBoard();
    }
}
// workout class to be init by the user at the start of a class 
class workout{
    constructor(workoutClass,sex,age,weight){
        this.classID = workoutClass.classID;
        this.duration = workoutClass.duration;
        this.bPM = 0;
       //HealthKit APi
        this.percentageIncrease = 0; 
        this.pace = 0;
        this.date = new Date();
        this.arrayOfBPM = healthKitStore.heartbeatSeries(this.inPropress);
        this.inProgress = true ;
        this.user = {
            sex:sex,
            age:age,
            weight:weight
        };
        this.leaderboaderValue = 0;
    }
    getBPM(){
        let total= this.arrayOfBPM.reduce((a,b) => a + b)
        this.bPM = total/this.arrayOfBPM.length();
        let peakBPM= this.arrayOfBPM.sort(function(a, b){return b - a})[0]
        this.percentageIncrease = (peakBPM - this.arrayOfBPM[0]) /100
    }

//Male: Calories/min = (-55.0969 + (0.6309 * Heart Rate) + (0.1988 * Weight) + (0.2017 * Age)) / 4.184
//Female: Calories/min = (-20.4022 + (0.4472 * Heart Rate) - (0.1263 * Weight) + (0.074 * Age)) / 4.184
    leadboardScore(){
        if(this.user.sex === "Male"){
            let heartRate = 0.6309 * this.bPM;
            let weight = 0.01988 * this.user.weight;
            let age = .2017 * this.user.age
            let caloriesPerMin =  (-55.0969 + heartRate + weight + age) / 4.184;
        } else{
            let heartRate = 0.4472* this.bPM;
            let weight = 0.1263 * this.user.weight;
            let age = .074 * this.user.age;
            let caloriesPerMin =  (-20.4022 + heartRate + weight + age) / 4.184;
        }
       let lbScore = ( caloriesPerMin + this.percentageIncrease)/100.00
       return lbScore
    }
}

//leaderBoard Class
class leaderBoard{
     constuctor(){
         this.leaderBoardStore = [];
     }
     addScore(score){
         this.leaderBoardStore.push(score)
     }
}
//user init
const sallyJohnson = new user('Sally Johnson',23, 120,"female")
//workoutclass init
const tabattaWorkout = new workoutClass(2,20,"billy Blake","tabatta Workout")
//workout init
sallyJohnson.startWorkout(tabattaWorkout); 
//Metabolic Functions 
