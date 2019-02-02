const Rental = require('./models/rentals');
const User = require('./models/user');

class FakeDb {

    constructor() {
        this.rentals = [{
            title: "Nice view on ocean",
            city: "San Francisco",
            street: "Main street",
            category: "condo",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 4,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 43
        },
        {
            title: "Modern apartment in center",
            city: "New York",
            street: "Time Square",
            category: "apartment",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 1,
            shared: false,
            description: "Very nice apartment in center of the city.",
            dailyRate: 11
        },
        {
            title: "Old house in nature",
            city: "Spisska Nova Ves",
            street: "Banicka 1",
            category: "house",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 5,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 23
        }];

        this.users = [{
            "username": "csaride",
	        "email": "csaride136@gmail.com",
	        "password": "HelloWorld@123"
        }];

    }

    pushDataToDb(){
        const user = new User(this.users[0]);
        user.rentals = this.rentals;
        this.rentals.forEach((rental) => {
            const newRental = new Rental(rental);
            newRental.user = user;
            newRental.save();
          });
        user.save();
    }


    async cleanDb(){
        await User.remove({});
        await Rental.remove({});
    }

    async seedDb() {
        await this.cleanDb();
        this.pushDataToDb();
      }
}


module.exports = FakeDb;