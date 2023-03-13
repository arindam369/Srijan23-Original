import { database } from "@/firebase";
import { notification } from "antd";
import { set, ref as ref_database, onValue, update, remove} from "firebase/database";
import uuid from "react-uuid";


export async function registerAccount(userId, name, email, phone, college, dept, year){
    set(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        name: name,
        email: email,
        phone: phone,
        college: college,
        dept: dept,
        year: year,
        avatar: `https://firebasestorage.googleapis.com/v0/b/srijan23-original.appspot.com/o/alphabets%2F${name.trim()[0].toUpperCase()}.jpg?alt=media&token=597912f6-4edb-4756-842f-5a41b31223ba`
    }).then((res) => {
        // console.log("User registrated successfully!");
    })
    .catch((err) => {
        // console.log(err);
        // console.log("User Registration failed...");
    });
}
export async function registerUsingGoogleAccount(userId, name, email){
    update(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        name: name,
        email: email,
        isVerified: true
    }).then((res) => {
        onValue(ref_database(database, 'srijan/profiles/' + userId + '/profiledata/avatar') , (snapshot)=>{
            if(snapshot.val() === null){
                update(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
                    avatar: `https://firebasestorage.googleapis.com/v0/b/srijan23-original.appspot.com/o/alphabets%2F${name.trim()[0].toUpperCase()}.jpg?alt=media&token=597912f6-4edb-4756-842f-5a41b31223ba`
                });
            }
        }, {
            onlyOnce: true
        });
    })
    .catch((err) => {
        // console.log(err);
        // console.log("User Registration failed...");
    });
}
export async function updateProfile(userId, dataType, newData, stopLoading){
    update(ref_database(database, 'srijan/profiles/' + userId + '/profiledata'), {
        [dataType]: newData
    }).then((res)=>{
        // console.log("Profile updated successfully");
        stopLoading();
    }).catch((err)=>{
        // console.log("Profile updation failed...");
    })
}

export async function makeEventInterested(userId, eventId, eventName){
    set(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents' + `/${eventId}`), {
        eventName: eventName
    }).then(()=>{
        // console.log("This event is made interested");
    }).catch((err)=>{
        // console.log("Making of this event as interested is failed");
        // console.log(err);
    })
}
export async function makeEventUnInterested(userId, eventId, eventName){
    remove(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents' + `/${eventId}`)).then(()=>{
        // console.log("This event is made interested");
    }).catch((err)=>{
        // console.log("Making of this event as interested is failed");
        // console.log(err);
    })
}
export const getAllInterestedEvents = (userId)=>{
    return onValue(ref_database(database, 'srijan/profiles/' + userId + '/interestedEvents') , (snapshot)=>{
        // console.log(snapshot && snapshot.val());
        return snapshot.val();
    }, {
        onlyOnce: true
    });
}
export async function bookMerchandise(fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod){
    const userId = email.split("@")[0].replace(/[.+-]/g, "_");

    onValue(ref_database(database, 'srijan/merchandise/'+userId), (snapshot) => {
        if(snapshot.val() !== null){
            notification['error']({
                message: `You have already placed an order`,
                duration: 2
            })
            return;
        }
        else{
            set(ref_database(database, 'srijan/merchandise/' + userId), { fullname, email, phone, college, dept, tshirtName, tshirtColor, tshirtSize, paymentMethod}
            ).then((res) => {
                // console.log("Merchandise Booked successfully!");
                notification['success']({
                    message: `Order placed successfully`,
                    duration: 2
                })
            })
            .catch((err) => {
                // console.log("Booking failed for Merchandise...");
                notification['error']({
                    message: `Order failed for merchandise`,
                    duration: 2
                })
            });
        }
    }, {
        onlyOnce: true
    });
}


export async function registerEvent(eventId, teamName, teamLeaderEmail, teamLeaderPhone, member2, member3, member4, member5, eventName){
    try{
        if(!teamLeaderEmail || teamLeaderEmail.trim().length === 0){
            notification['error']({
                message: `You are not logged in`,
                duration: 2
            })
            return;
        }
        let isOkay = true;
        onValue(ref_database(database, 'srijan/events/'+eventId+'/teams/'+teamName) , async (snapshot)=>{
            if(snapshot){
                if(snapshot.val() !== null){
                    notification['error']({
                        message: `A team with the name '${teamName}' already exists`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }

                const teamNameRegex = /^[a-zA-Z0-9]{3,16}$/;
                if (!teamNameRegex.test(teamName)) {
                    notification['error']({
                        message: `Invalid team name. Team name should be 3-16 letters long and should contain letters or numbers`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }

                const emails = [teamLeaderEmail, member2, member3, member4, member5].filter(email => email !== "");
                const duplicates = [...new Set(emails.filter((item, index) => emails.indexOf(item) !== index))];
                if (duplicates.length > 0) {
                    notification['error']({
                        message: `Duplicate email found`,
                        duration: 2
                    })
                    isOkay=false;
                    return;
                }

                const teamDetails = {
                    teamName: teamName,
                    leadEmail: teamLeaderEmail,
                    leadContact: teamLeaderPhone,
                    members: {
                        0: {
                            email: teamLeaderEmail,
                            status: true
                        }
                    },
                }

                if(member2.trim().length > 0){
                    const memberId2 = member2.split("@")[0].replace(/[.+-]/g, "_");
                    onValue(ref_database(database, 'srijan/profiles/' + memberId2), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member2}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId2+"/events/"+eventId), (snapshot) => {
                            const eventFound = snapshot.val() || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member2} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[1] = {
                            email: member2,
                            status: false
                        }
                    }, {
                        onlyOnce: true
                    });
                }
                if(member3.trim().length > 0){
                    const memberId3 = member3.split("@")[0].replace(/[.+-]/g, "_");
                    onValue(ref_database(database, 'srijan/profiles/' + memberId3), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member3}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId3+"/events/"+eventId), (snapshot) => {
                            const eventFound = snapshot.val() || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member3} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[2] = {
                            email: member3,
                            status: false
                        }
                    }, {
                        onlyOnce: true
                    });
                }
                if(member4.trim().length > 0){
                    const memberId4 = member4.split("@")[0].replace(/[.+-]/g, "_");
                    onValue(ref_database(database, 'srijan/profiles/' + memberId4), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member4}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId4+"/events/"+eventId), (snapshot) => {
                            const eventFound = snapshot.val() || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member4} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[3] = {
                            email: member4,
                            status: false
                        }
                    }, {
                        onlyOnce: true
                    });
                }
                if(member5.trim().length > 0){
                    const memberId5 = member5.split("@")[0].replace(/[.+-]/g, "_");
                    onValue(ref_database(database, 'srijan/profiles/' + memberId5), (snapshot) => {
                        const userFound = (snapshot.val() && snapshot.val().profiledata) || null;
                        if(userFound === null){
                            notification['error']({
                                message: `There is no Srijan account for ${member5}`,
                                duration: 2
                            })
                            isOkay=false;
                            return;
                        }
                        
                        onValue(ref_database(database, 'srijan/profiles/' + memberId5+"/events/"+eventId), (snapshot) => {
                            const eventFound = snapshot.val() || null;
                            if(eventFound !== null){
                                notification['error']({
                                    message: `${member5} has already registered in this event`,
                                    duration: 2
                                })
                                isOkay=false;
                                return;
                            }
                        }, {
                            onlyOnce: true
                        });
                        teamDetails.members[4] = {
                            email: member5,
                            status: false
                        }
                    }, {
                        onlyOnce: true
                    });
                }
                setTimeout(async ()=>{
                    if(isOkay){
                        // everything is fine
                        // save data in team, member1, member2, member3, member4, member5
                        if(member2.trim().length === 0 && member3.trim().length === 0 && member4.trim().length === 0 && member5.trim().length === 0){
                            await set(ref_database(database, 'srijan/events/'+eventId+"/teams/"+teamName), {
                                eventName: eventName,
                                isRegistered: true,
                                teamDetails: teamDetails
                            });
    
                            await set(ref_database(database, 'srijan/profiles/' + teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                teamName: teamName,
                                eventName: eventName,
                                status: true,
                                isRegistered: true,
                                teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                            })
                            update(ref_database(database, 'srijan/profiles/' + teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_") + '/notifications/' + uuid()), {
                                message: `Registration Successful: You have successfully registered in the event: '${eventName}'`,
                                timestamp: Date.now()
                            });
                        }
                        else{
                            await set(ref_database(database, 'srijan/events/'+eventId+"/teams/"+teamName), {
                                eventName: eventName,
                                isRegistered: false,
                                teamDetails: teamDetails
                            });

                            await set(ref_database(database, 'srijan/profiles/' + teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                teamName: teamName,
                                eventName: eventName,
                                status: true,
                                isRegistered: false,
                                teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                            })
                            if(member2.trim().length > 0){
                                await set(ref_database(database, 'srijan/profiles/' + member2.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                    teamName: teamName,
                                    eventName: eventName,
                                    status: false,
                                    isRegistered: false,
                                    teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                                })
                            }
                            if(member3.trim().length > 0){
                                await set(ref_database(database, 'srijan/profiles/' + member3.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                    teamName: teamName,
                                    eventName: eventName,
                                    status: false,
                                    isRegistered: false,
                                    teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                                })
                            }
                            if(member4.trim().length > 0){
                                await set(ref_database(database, 'srijan/profiles/' + member4.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                    teamName: teamName,
                                    eventName: eventName,
                                    status: false,
                                    isRegistered: false,
                                    teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                                })
                            }
                            if(member5.trim().length > 0){
                                await set(ref_database(database, 'srijan/profiles/' + member5.split("@")[0].replace(/[.+-]/g, "_") + '/events' + `/${eventId}`), {
                                    teamName: teamName,
                                    eventName: eventName,
                                    status: false,
                                    isRegistered: false,
                                    teamLeader: teamLeaderEmail.split("@")[0].replace(/[.+-]/g, "_")
                                })
                            }
                        }
                        notification['success']({
                            message: `Event registered successfully`,
                            duration: 2
                        })
                    }
                }, 10000);
            }
        }, {
            onlyOnce: true
        });
    }
    catch(err){
        // console.log(err);
    }
}
export function getTimeDifference(timeStamp){
    const nowTime = Date.now();
    const timeDifference = Math.floor((nowTime-timeStamp)/1000);
    if(timeDifference<=0){
        return "0sec ago"
    }

    if(timeDifference < 60){    // 1-59secs
        return `${timeDifference}secs ago`;
    }
    else{
        const timeDiff_in_minutes = Math.floor(timeDifference/60);
        if(timeDiff_in_minutes<60){     // 1-59mins
            const unit = timeDiff_in_minutes === 1 ?"min":"mins";
            return `${timeDiff_in_minutes}${unit} ago`;
        }
        else{
            const timeDiff_in_hours = Math.floor(timeDiff_in_minutes/60);   // 1-23hrs
            if(timeDiff_in_hours < 24){
                const unit = timeDiff_in_hours === 1 ?"hour":"hours";
                return `${timeDiff_in_hours}${unit} ago`;
            }
            else{
                const timeDiff_in_days = Math.floor(timeDiff_in_hours/24);  // 1-29days
                if(timeDiff_in_days < 30){
                    const unit = timeDiff_in_days === 1 ?"day":"days";
                    return `${timeDiff_in_days}${unit} ago`;
                }
                else{
                    const timeDiff_in_months = Math.floor(timeDiff_in_days/30); // 1-11months
                    if(timeDiff_in_months < 12){
                        const unit = timeDiff_in_months === 1 ?"month":"months";
                        return `${timeDiff_in_months}${unit} ago`;
                    }
                    else{
                        const timeDiff_in_years = Math.floor(timeDiff_in_months/12); // 1-...years
                        const unit = timeDiff_in_years === 1 ?"year":"years";
                        return `${timeDiff_in_years}${unit} ago`;
                    }
                }
            }
        }
    }
}