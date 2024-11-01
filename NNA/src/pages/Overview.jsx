import SingleLineChart from "../components/SingleLineChart";
import BiaxialLineChart from "../components/BiaxialChart";

function Overview() {
  return (
    <div>
      <h3> Epoch/Loss of Overall Agents </h3>
      <SingleLineChart />
      <h3> Training Time and Accuracy of Overall Agents </h3>
      <BiaxialLineChart />
    </div>
  );
}

export default Overview;
