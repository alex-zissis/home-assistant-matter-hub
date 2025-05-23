import type { ServiceAreaClusterState } from "@home-assistant-matter-hub/common";

export interface ServiceAreaStateProps {
  state: ServiceAreaClusterState;
}

export const ServiceAreaState = (props: ServiceAreaStateProps) => {
  const { areas } = props.state;
  if (Array.isArray(areas)) {
    return (
      <ul>
        {areas.map((area, idx) => (
          <li key={area.mapId ?? idx}>{area.name ?? `Area ${idx + 1}`}</li>
        ))}
      </ul>
    );
  }
  return <div>serviceArea state: {JSON.stringify(props.state)}</div>;
};
