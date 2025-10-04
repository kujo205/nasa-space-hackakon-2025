export interface OrbitData {
  discovery: Discovery;
  phys_par: PhysPar[];
  ca_data: CaData[];
  orbit_defs: OrbitDefs;
  orbit: Orbit;
  sat: any[];
  vi_data: any[];
  signature: Signature;
  radar_obs: any[];
  alt_orbits: any[];
  object: ObjectDetails;
}

export interface Discovery {
  citation: null;
  site: null;
  discovery: string;
  location: string;
  who: string;
  date: string;
  name: null;
  ref: null;
  cref: null;
}

export interface PhysPar {
  sigma: null;
  title: string;
  notes: null;
  desc: string;
  ref: string;
  name: string;
  units: null;
  value: string;
}

export interface CaData {
  sigma_t: string;
  jd: string;
  dist: string;
  orbit_ref: string;
  body: "Mars" | "Earth";
  v_rel: string;
  dist_min: string;
  sigma_tf: string;
  dist_max: string;
  cd: string;
  v_inf: string;
}

export interface OrbitDefs {
  per: Definition;
  jupobl: Definition;
  rms_u: Definition;
  n_dop_obs: Definition;
  n_del_obs_used: Definition;
  not_valid_before: Definition;
  eihrel: Definition;
  n_obs_used: Definition;
  not_valid_after: Definition;
  comment: Definition;
  first_obs: Definition;
  w: Definition;
  moid: Definition;
  jgsep: Definition;
  eobl_lim: Definition;
  pe_used: Definition;
  neo: Definition;
  rms_w: Definition;
  pha: Definition;
  relativity: Definition;
  rms: Definition;
  t_jup: Definition;
  cov_kind: Definition;
  e: Definition;
  producer: Definition;
  n: Definition;
  n_opt_obs: Definition;
  jupj4: Definition;
  ma: Definition;
  n_opp: Definition;
  n_sat_obs_used: Definition;
  i: Definition;
  q: Definition;
  moid_jup: Definition;
  a: Definition;
  condition_code: Definition;
  emsep: Definition;
  src: Definition;
  h_value: Definition;
  n_sat_obs: Definition;
  sb_used: Definition;
  sobl_lim: Definition;
  data_arc: Definition;
  cov: Definition;
  tp: Definition;
  n_opt_obs_used: Definition;
  constraint_vec: Definition;
  ad: Definition;
  n_dop_obs_used: Definition;
  eobl_mod: Definition;
  two_body: Definition;
  n_del_obs: Definition;
  h_sigma: Definition;
  soln_date: Definition;
  cmod_version: Definition;
  source: Definition;
  om: Definition;
  perturbers: Definition;
  epoch: Definition;
  last_obs: Definition;
}

export interface Definition {
  description: string;
  units: string | null;
  title: string | null;
}

export interface Orbit {
  condition_code: string;
  n_del_obs_used: null;
  not_valid_before: null;
  moid_jup: string;
  first_obs: string;
  moid: string;
  comment: string;
  not_valid_after: null;
  data_arc: string;
  n_obs_used: number;
  sb_used: string;
  rms: string;
  t_jup: string;
  source: string;
  producer: string;
  soln_date: string;
  equinox: string;
  elements: Element[];
  model_pars: ModelPar[];
  pe_used: string;
  two_body: null;
  n_dop_obs_used: null;
  last_obs: string;
  epoch: string;
  epoch_cd: string;
  cov_epoch: string;
}

export interface Element {
  label: string;
  sigma: string | null;
  name: string;
  value: string;
  title: string;
  units: string | null;
}

export interface ModelPar {
  value: string;
  title: string;
  units: string | null;
  kind: "EST" | "SET";
  n: number;
  desc: string;
  name: string;
  sigma: string | null;
}

export interface Signature {
  version: string;
  source: string;
}

export interface ObjectDetails {
  des_alt: DesAlt[];
  orbit_id: string;
  kind: string;
  des: string;
  neo: boolean;
  fullname: string;
  orbit_class: OrbitClass;
  spkid: string;
  pha: boolean;
  prefix: null;
  ov_par: string;
}

export interface DesAlt {
  pri: string;
}

export interface OrbitClass {
  code: string;
  name: string;
}
