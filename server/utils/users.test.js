const expect = require('expect');
const {Users} = require('./users');


describe('Users', () => {
    var users;

    beforeEach(() => {
      users = new Users();
      users.users = [{
        id: '1',
        name: 'Jeff',
        room: '_Room48'
      },{
        id: '2',
        name: 'Barry',
        room: '_Room42'
      },{
        id: '3',
        name: 'John',
        room: '_Room48'
      }]
    })
  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '1591',
      name: 'Jeff',
      room: 'Room46'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });
  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '43';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);

  });

  it('should find a user', () => {
    var userId = '1';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    var userId = '4';
    var user = users.getUser(userId);

    expect(user).toNotExist();

  });

  it('should return 2 names for room', () => {
    var userList = users.getUserList('_Room48');

    expect(userList).toEqual(['Jeff','John']);
  })
  it('should return 1 name for room', () => {
    var userList = users.getUserList('_Room42');

    expect(userList).toEqual(['Barry']);
  })
  it('should return all online users', () => {
    var users = users.getAllUsers();
    console.log(users)
    expect(users).toBe(array)
  })
  });
