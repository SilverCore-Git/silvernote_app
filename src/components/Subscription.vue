
<template>

    <div 
        class="w-full space-y-5"
    >

        <section 
            v-if="subscriptions && localuser && !loading"
            v-for="sub in subscriptions" :key="sub.id"    
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
            
            <div class="flex items-center justify-between">

                <h2 class="text-2xl font-bold" :style="{ color: plan_color }">
                    {{ localuser.plan.name }} Plan <span class="text-red-600 font-bold">{{ sub.cancel_at_period_end ? '- Résilier' : '' }}</span>
                </h2>

                <span 
                    v-if="!sub.cancel_at_period_end"
                    class="text-sm bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wide"
                    :style="{ color: plan_color }"
                >
                    {{ sub.items.data[0].price.unit_amount / 100 }} 
                    {{ sub.items.data[0].price.currency.toUpperCase() }} / 
                    {{ sub.items.data[0].price.recurring.interval }}
                </span>

                <span 
                    v-if="sub.cancel_at_period_end"
                    class="text-sm bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wide text-red-600 font-bold"
                >
                    fini le {{ 
                        new Date(sub.cancel_at * 1000).toLocaleDateString('fr-FR', {
                            weekday: 'long', 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    }}
                </span>

            </div>

            <div class="mt-4 flex justify-between items-end text-gray-700 text-sm">
                
                <div>

                    <div class="flex flex-col">


                        <p>
                            <strong>Status:</strong>
                            {{ sub.status }}
                        </p>

                        <p>
                            <strong>Formule:</strong>
                            {{ localuser.plan.family ? 'Famille' : 'Individuelle' }}
                        </p>
                        
                    </div>

                    <div class="text-gray-400 text-xs mt-4 truncate">
                        <span><strong>SUBSCRIPTIONS_ID :</strong> {{ sub.id || "undefined" }}</span><br />
                        <span><strong>PLAN_ID :</strong> {{ localuser.plan.uuid || "undefined" }}</span>
                    </div>

                </div>

                <button 
                    class="perso" 
                    :style="{ '--btn-color': plan_color }"
                >
                    Résilier l'abonnement
                </button>
            

            </div>

        </section>


        <section
            v-else
            v-for="index in 3" 
            :key="index"
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
            
            <div class="flex items-center justify-between">

                <h2 class="text-2xl font-bold animate-pulse bg-gray-300 w-55 h-8 rounded-full" ></h2>

                <span 
                    class="text-sm px-3 py-1 uppercase tracking-wide
                    animate-pulse bg-gray-300 w-40 h-6 rounded-full"
                ></span>

            </div>

            <div class="mt-4 flex justify-between items-end text-gray-700 text-sm">
                
                <div>

                    <div class="flex flex-col">


                        <p class="animate-pulse bg-gray-300 w-40 h-4 mb-0.5 rounded-full">
                        </p>

                        <p class="animate-pulse bg-gray-300 w-50 h-4 rounded-full">
                        </p>
                        
                    </div>

                    <div class="text-gray-400 text-xs mt-4 truncate">
                        <div class="animate-pulse bg-gray-300 h-3 w-110 rounded-full"></div>
                        <div class="animate-pulse bg-gray-300 h-3 w-90 rounded-full"></div>
                    </div>

                </div>

                <div class="animate-pulse bg-gray-300 h-11 w-45 rounded-md"></div>

            </div>

        </section>


        <section class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">

            <h2 class="text-xl font-semibold mb-2">Moyens de paiement</h2>

            <div v-if="paymentMethods.length" >
                
                <ul>
                    
                    <li v-for="pm in paymentMethods" :key="pm.id" class="py-2">
                    
                        {{ pm.card.brand.toUpperCase() }} •••• •••• •••• {{ pm.card.last4 }}
                        <span class="text-gray-500 text-sm">exp. {{ pm.card.exp_month }}/{{ pm.card.exp_year }}</span>
                    
                    </li>

                </ul>
            
            </div>

            <p v-else class="text-gray-500">Aucun moyen de paiement enregistré.</p>

        </section>


    </div>

</template>



<script setup>

import { ref, onMounted } from 'vue'
import { useUser } from '@clerk/vue'

const customer = ref(null);
const localuser = ref(null);
const paymentMethods = ref([]);
const subscriptions = ref([]);
const loading = ref(true);
const error = ref(null);
const plan_color = ref('');

const customerId = 'cus_SppxMS2MA5aEBd'
const { user, isloaded } = useUser();

async function fetchCustomerData() {

  try {

    const loaded = await isloaded;
    console.log(await loaded);

    const res = await fetch(`http://localhost:3000/money/customer/${customerId}/${user.value.id}`);

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    const data = await res.json();

    localuser.value = data.localuser;
    customer.value = data.customer;
    paymentMethods.value = data.paymentMethods || [];
    subscriptions.value = data.subscriptions || [];

    plan_color.value = localuser.value.plan.color || 'var(--btn)';

  } catch (err) {
    error.value = err.message;

  } finally {
    loading.value = false;
  }

}

onMounted(fetchCustomerData);


</script>

