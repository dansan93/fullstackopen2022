const Header = ({course}) => <h1>{course}</h1>;

const Part = ({part}) => <div>{part.name} {part.exercises}</div>;

const Content = ({parts}) => parts.map(part => <Part key={part.id} part={part}/>);

const Total = ({parts}) => {
    const total = parts.map(part => part.exercises).reduce((sum, e) => sum + e, 0);
    return <p>Total of {total} exercises</p>;
}

const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
}

export default Course;