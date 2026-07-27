export type AnalyticsEventMap = {
  cta_clicked: {
    cta_id: "public_home";
    placement: "public";
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventFor<Name extends AnalyticsEventName> = {
  name: Name;
  properties: AnalyticsEventMap[Name];
};

export type AnalyticsEvent = {
  [Name in AnalyticsEventName]: AnalyticsEventFor<Name>;
}[AnalyticsEventName];

export type TrackEventArgs<Name extends AnalyticsEventName> = [
  properties: AnalyticsEventMap[Name],
];

export function createAnalyticsEvent<Name extends AnalyticsEventName>(
  name: Name,
  ...[properties]: TrackEventArgs<Name>
): AnalyticsEventFor<Name> {
  return { name, properties };
}
