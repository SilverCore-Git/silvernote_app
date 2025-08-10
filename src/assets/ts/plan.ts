import { UUID } from "crypto";


export interface Plan {
    name: string;
    uuid: UUID;
    color: string;
    sub_id?: string;
    void?: boolean;
    plan_data?: {
        each?: 'month' | 'year' | 'life';
        family?: boolean;
        family_data?: {
            owner?: boolean;
        }
    }
};


const plans: Plan[] = [

    { 
        name: "Silver", 
        color: '#757575', // gris argenté
        uuid: "e9009da1-e1e6-448d-b264-353ba8c0a850"
    },

    { 
        name: "Gold", 
        color: '#FFD700', // doré
        uuid: "7350f460-ed5c-4286-b598-85b894d2616a" 
    },

    { 
        name: "Platinum", 
        color: '#527AA3', // gris platine
        uuid: "4c1c20f8-06b7-4e29-afb4-38d4b482e302" 
    },

    { 
        name: "Ultimate", 
        color: '#8A2BE2', // violet intense (couleur distinctive)
        uuid: "e5643c29-cb91-4c9a-a14b-ea5d9919a47d" 
    },

];


export const get_silver_plan = (): Plan => {
    return plans.filter(plan => plan.name == 'silver')[0];
} 


export function get_plan_by_name(
  name: string,
  sub_id: string,
  plan_data?: {
    each?: 'month' | 'year' | 'life';
    family?: boolean;
    family_data?: { owner?: boolean };
  }
) {
  const defaultPlan = get_silver_plan();

  const found = plans.find(p => p.name === name);
  if (found) found.sub_id = sub_id;
  const basePlan = found || defaultPlan;

  const isSilver = basePlan.name === "Silver";
  const plan = { ...basePlan };

  if (!isSilver && plan_data) {
    plan.plan_data = plan_data;
  }

  return plan;
}
