class Rooms {
  constructor () {
    this.rooms = [];
  }
  addRoom (room) {
    this.rooms.push(room);
    return room;
  }
  removeRoom (room){
    // var index = this.rooms.indexOf(room);
    // this.rooms.splice(index, 1);
    // console.log(this.rooms)
    // console.log(`[${room}] had 0 users and was deleted`);
    for(var i = 0; i < this.rooms.length; i++){
       if(this.rooms[i]==room) {
           this.rooms.splice(i,1);
           i--; // Prevent skipping an item
       }
   }
   console.log(`Channel [${room}] was removed`)
    }

    removeDuplicates() {
      return this.rooms.filter(function (room, index, self){
      return (self.indexOf(room) == index)
      })
  }
  }

module.exports = {Rooms};
