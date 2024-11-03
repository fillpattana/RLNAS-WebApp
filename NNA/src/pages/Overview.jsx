import SingleLineChart from "../components/SingleLineChart";
import BiaxialLineChart from "../components/BiaxialChart";

function Overview() {
  return (
    <div>
      <h3> Overall Epoch/Loss of Agents </h3>
      <SingleLineChart />
      <h3> Overall Training Time and Accuracy of Agents </h3>
      <BiaxialLineChart />
    </div>
  );
}

export default Overview;
