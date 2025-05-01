//exelmples de WE LOVE DEV
const objetct = {
	_id: "5beca8f00000000000000000",
	name: "Rayed",
	contacts: {tel: "+123456789", email: "rayed@email.com"},
	status: "en poste",
};

const createStudent = async (object) => {
	const collection = db.collection("students");
	const student = await collection.insertOne(object);
	return student;
};

const newStudent = {
	name: "rayed",
	status: "étudiant",
};
const insertStudent = await createStudent(newStudent);
console.log(newStudent);
