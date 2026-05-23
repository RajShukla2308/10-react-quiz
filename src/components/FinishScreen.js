export function FinishScreen({points,maxPossiblePoints, highScore}){
    const percentage = (points/maxPossiblePoints) * 100;
    return (
        <>
        <p className="result">
        You scroed <strong>{points} out of {maxPossiblePoints} ({Math.ceil(percentage)}%)</strong>
        </p>
        <p className="highscore">(Highscore: {highScore} points)</p>
        </>
    )
}