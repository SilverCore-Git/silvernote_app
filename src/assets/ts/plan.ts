import { UUID } from "crypto";


export interface Plan {
    name: string;
    uuid: UUID;
    void?: boolean;
};


const plans: Plan[] = [
    
    { 
        name: "silver", 
        uuid: "e9009da1-e1e6-448d-b264-353ba8c0a850" 
    },
    
    { 
        name: "gold", 
        uuid: "7350f460-ed5c-4286-b598-85b894d2616a" 
    },
    
    { 
        name: "platinum", 
        uuid: "4c1c20f8-06b7-4e29-afb4-38d4b482e302" 
    },
    
    { 
        name: "ultimate", 
        uuid: "e5643c29-cb91-4c9a-a14b-ea5d9919a47d" 
    },

]

export const get_silver_plan = (): Plan => {
    return plans.filter(plan => plan.name == 'silver')[0];
} 

export function get_plan_by_id (id?: UUID) {

    return plans.find(plan => plan.uuid == id) || get_silver_plan();

}