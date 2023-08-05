const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

var sequelize = new Sequelize('gvgfqxmk', 'gvgfqxmk', 'HeJWMc0ioNrjsM2pKhPB6OnzO-2D9WYb', {
  host: 'stampy.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

const Student = sequelize.define('student', {
  studentNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
});

const Course = sequelize.define('course', {
  courseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
  return sequelize.sync()
      .then(() => {
          console.log('Database connected....');
      })
      .catch((err) => {
          console.error('Error syncing the database:', err);
          throw new Error('Unable to sync the database');
      });
};

module.exports.addStudent = function (studentData) {
    return Student.create({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressProvince: studentData.addressProvince,
        TA: studentData.TA,
        status: studentData.status
    });
};

module.exports.getAllStudents = function () {
  return Student.findAll()
      .then((students) => {
          if (students.length > 0) {
              return students;
          } else {
              throw new Error('No results returned');
          }
      });
};

module.exports.getTAs = function () {
    return Student.findAll({ where: { TA: true } });
};

module.exports.getCourses = function () {
  return Course.findAll()
      .then((courses) => {
          if (courses.length > 0) {
              return courses;
          } else {
              throw new Error('No results returned');
          }
      });
};

module.exports.getStudentByNum = function (num) {
  return Student.findOne({ where: { studentNum: num } })
      .then((student) => {
          if (student) {
              return student;
          } else {
              throw new Error('No results returned');
          }
      });
};

module.exports.getStudentsByCourse = function (course) {
  return Student.findAll({ where: { course: course } })
      .then((students) => {
          if (students.length > 0) {
              return students;
          } else {
              throw new Error('No results returned');
          }
      });
};

module.exports.getCourseById = function (courseId) {
  return Course.findOne({ where: { courseId: courseId } })
      .then((course) => {
          if (course) {
              return course;
          } else {
              throw new Error('No results returned');
          }
      });
};

module.exports.updateStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;

  for (const prop in studentData) {
      if (studentData[prop] === "") {
          studentData[prop] = null;
      }
  }

  return Student.update(studentData, { where: { studentNum: studentData.studentNum } });
};


module.exports.addStudent = function (studentData) {
  studentData.TA = studentData.TA ? true : false;

  for (const prop in studentData) {
      if (studentData[prop] === "") {
          studentData[prop] = null;
      }
  }

  return Student.create(studentData);
};

module.exports.updateStudent = function (studentData) {
    studentData.TA = studentData.TA ? true : false;

    for (const prop in studentData) {
        if (studentData[prop] === "") {
            studentData[prop] = null;
        }
    }

    return Student.update(studentData, { where: { studentNum: studentData.studentNum } });
};

module.exports.addCourse = function (courseData) {
  for (const prop in courseData) {
      if (courseData[prop] === "") {
          courseData[prop] = null;
      }
  }

  return Course.create(courseData);
};


module.exports.updateCourse = function (courseData) {
  return Course.findByPk(courseData.courseId)
    .then((course) => {
      if (course) {
        return course.update(courseData);
      } else {
        throw new Error('Course not found');
      }
    })
    .catch((err) => {
      throw new Error('Unable to update course');
    });
};


module.exports.deleteStudent = function (studentNum) {
    return Student.destroy({ where: { studentNum: studentNum } });
};

module.exports.deleteCourse = function (courseId) {
    return Course.destroy({ where: { courseId: courseId } });
};

module.exports.updateCourse = function (courseData) {
  return Course.update(courseData, {
    where: {
      courseId: courseData.courseId,
    },
    returning: true,
  });
};

module.exports.saveStudentsToFile = function () {
    fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students, null, 2), (err) => {
        if (err) {
            console.error("Error saving students data to file:", err);
        } else {
            console.log("Students data saved to file successfully.");
        }
    });
};

// Export the models for use in other parts of the application
module.exports.Student = Student;
module.exports.Course = Course;
