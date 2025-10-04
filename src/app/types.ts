export interface SBDBResponse {
  signature: {
    version: string;
    source: string;
  };
  alt_orbits: any[]; //  Type this if you know the structure, otherwise `any[]`
  sat: any[]; //  Type this if you know the structure, otherwise `any[]`
  orbit_defs: {
    [key: string]: {
      description: string | null;
      units: string | null;
      title: string | null;
    };
  };
  ca_data: {
    cd: string;
    dist: string;
    orbit_ref: string;
    v_inf: string;
    body: string;
    dist_min: string;
    jd: string;
    v_rel: string;
    dist_max: string;
    sigma_tf: string;
    sigma_t: string;
  }[];
  vi_data: any[]; //  Type this if you know the structure, otherwise `any[]`
  phys_par: {
    value: string;
    units: string | null;
    title: string;
    ref: string;
    desc: string;
    sigma: string | null;
  }[];
  object: {
    orbit_class: {
      name: string;
      code: string;
    };
    prefix: string | null;
    fullname: string;
    orbit_id: string;
    des_alt: any[]; //  Type this if you know the structure, otherwise `any[]`
    spkid: string;
    ov_par: string;
    neo: boolean;
    kind: string;
    des: string;
    pha: boolean;
  };
  discovery: {}; // Empty object - you can be more specific if it has properties
  orbit: {
    comment: string | null;
    last_obs: string;
    cov_epoch: string;
    moid: string;
    epoch: string;
    moid_jup: string;
    sb_used: string;
    equinox: string;
    rms: string;
    elements: {
      sigma: string;
      label: string;
      name: string;
      value: string;
      title: string;
      units: string | null;
    }[];
    two_body: any | null; //  Type this if you know the structure, otherwise `any | null`
    not_valid_after: string | null;
    orbit_id: string;
    t_jup: string;
    producer: string;
    model_pars: any[]; //  Type this if you know the structure, otherwise `any[]`
    pe_used: string;
    n_obs_used: number;
    data_arc: string;
    soln_date: string;
    source: string;
    not_valid_before: string | null;
    n_dop_obs_used: any | null; // Type this if you know the structure, otherwise `any | null`
    n_del_obs_used: any | null; // Type this if you know the structure, otherwise `any | null`
    epoch_cd: string;
    condition_code: string;
    first_obs: string;
  };
  radar_obs: any[]; //  Type this if you know the structure, otherwise `any[]`
}

export interface NeoFeedResponse {
  links: {
    self: string;
    next?: string; // Optional
    prev?: string; // Optional
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NeoObject[];
  };
}

export interface NeoFeedResponseEnhanced {
  links: {
    self: string;
    next?: string; // Optional
    prev?: string; // Optional
  };
  element_count: number;

  final_data: (NeoObject & { nasa_jpl_data: SBDBResponse })[];
  near_earth_objects: {
    [date: string]: (NeoObject & { nasa_jpl_data: SBDBResponse })[];
  };
}

export interface NeoObject {
  links: {
    self: string;
  };
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string; // Could be number, check the API
      kilometers_per_hour: string; // Could be number, check the API
      miles_per_hour: string; // Could be number, check the API
    };
    miss_distance: {
      astronomical: string; // Could be number, check the API
      lunar: string; // Could be number, check the API
      kilometers: string; // Could be number, check the API
      miles: string; // Could be number, check the API
    };
    orbiting_body: string;
  }[];
  is_sentry_object: boolean;
  sentry_data?: string; // Optional
}
