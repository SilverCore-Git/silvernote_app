
<template>

    <div 
        class="w-full space-y-5"
    >

        <section 
            v-if="subscriptions.length && localuser && !loading"
            v-for="sub in subscriptions" :key="sub.id"    
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
            
            <div class="flex items-center justify-between">

                <h2 class="text-2xl font-bold" :style="{ color: localuser.plan.find(plan => plan.sub_id == sub.id)?.color || 'var(--btn)' }">
                    {{ localuser.plan.find(plan => plan.sub_id == sub.id)?.name || 'undefined' }} Plan <span class="text-red-600 font-bold">{{ sub.cancel_at_period_end ? '- Résilier' : '' }}</span>
                </h2>

                <span 
                    v-if="!sub.cancel_at_period_end"
                    class="text-sm bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wide"
                    :style="{ color: localuser.plan.find(plan => plan.sub_id == sub.id)?.color || 'var(--btn)' }"
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
                                {{ 
                                    localuser.plan.find(plan => plan.sub_id == sub.id)?.plan_data?.family == true 
                                        ? 'Famille' 
                                        : localuser.plan.find(plan => plan.sub_id == sub.id)?.plan_data?.family == false ? 'Individuelle' 
                                            : 'undefined'
                                }}
                        </p>
                        
                    </div>

                    <div class="text-gray-400 text-xs mt-4 truncate">
                        <span><strong>SUBSCRIPTIONS_ID :</strong> {{ sub.id || "undefined" }}</span><br />
                        <span><strong>PLAN_ID :</strong> {{ localuser.plan.find(plan => plan.sub_id == sub.id)?.uuid || "undefined" }}</span>
                    </div>

                </div>

                <button 
                    @click="cancel_sub(sub.id, sub.cancel_at_period_end)"
                    class="perso" 
                    :style="{ '--btn-color': localuser.plan.find(plan => plan.sub_id == sub.id)?.color || 'var(--btn)' }"
                    :class="sub.cancel_at_period_end ? 'saturate-0' : ''"
                >
                    Résilier l'abonnement
                </button>
            

            </div>

        </section>

        <section 
            v-else-if="!loading" 
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
            <h2>Aucun abonement trouvée !</h2>
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

        <h2 v-if="error" class="text-red-600">{{ error }}</h2>

    </div>

</template>



<script setup lang="js">

import { ref, onMounted } from 'vue'
import { useUser } from '@clerk/vue'

const customer = ref(null);
const localuser = ref(null);
const paymentMethods = ref([]);
const subscriptions = ref([]);
const loading = ref(true);
const error = ref(null);

const { user, isLoaded } = useUser();

const cancel_sub = async (sub_id, isCancel) => {

    if (isCancel) return;

    if (confirm("Es-tu sûr de vouloir continuer ?")) {

        await fetch('https://api.silvernote.fr/user/stripe/cancel/sub', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subId: sub_id })
        });

        fetchCustomerData();

    } else {
        return
    }

}

async function fetchCustomerData() {

  try {

    const loaded = await isLoaded;
    console.log(await loaded);

    const user_back_db = await fetch('https://api.silvernote.fr/user/get/data', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.value?.id })
    }).then(res => res.json());

    const res = await fetch(`https://api.silvernote.fr/money/customer/${(await user_back_db).customerId}/${user.value?.id}`);

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    const data = await res.json();

    if (data?.error?.code == "resource_missing") return;

    localuser.value = data.localuser;
    customer.value = data.customer;
    paymentMethods.value = data.paymentMethods || [];
    subscriptions.value = data.subscriptions || [];

  } catch (err) {
    error.value = err.message;
    loading.value = false;
  } finally {
    loading.value = false;
  }

}

onMounted(fetchCustomerData);


</script>

