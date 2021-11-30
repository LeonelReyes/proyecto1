<template>
  <div class="flex flex-center">
    <h3>Notas de la Universidad</h3>
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input outlined  label="Buscar en las notas..." v-model="filtro" />
    </div>
  </div>
  
  <div class="q-pa-md q-gutter-sm">
    <!-- Editor -->
    <q-editor 
      v-if = "!modoEdicion"
      v-model="editor"
      :definitions="{
            save: {
              tip: 'Tarea Guardada',
              icon: 'save',
              label: 'Guardar',
              handler: saveWork, 
              
            }
          }"
      :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['upload', 'save']
          ]"
    />

    <q-editor
      v-else
      v-model="editor"
      min-height="5rem"
      :definitions="{
        save: {
          tip: 'Actualizar nota',
          icon: 'save',
          label: 'Actualizar',
          handler: updateWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline','unordered', 'ordered'],
        ['save']
      ]"
    />

    <!-- Donde se pinta -->
    <q-card 
      class="row justify-between"
      flat 
      bordered 
      v-for="(item, index) in notasFiltradas" 
      :key="index"
    >

    <!-- <q-card
      flat
      bordered
      class="row justify-between"
      v-for="(item, index) in tasks"
      :key="index"
    > -->
      <q-card-section
        v-html="item.texto"
        class="col"
        :class="item.estado ? 'tachar' : ''"
      >
      </q-card-section>
      <q-btn flat color="blue" @click="editar(index, item.id)">Editar</q-btn>
      <q-btn flat color="red" @click="eliminar(index, item.id)">Eliminar</q-btn>
      <q-space />
    </q-card>
    <div v-if="tasks.length == 0" class="flex flex-center">
      <p class="text-h6">Sin notas</p>
    </div>

  </div>
</template>

<script>
import { db } from "boot/firebase";
  export default {
    data() {
      return {
        editor: '',
        tasks: [],
        index: null,
        modoEdicion: false,
        id: null,
        notasFiltradas: [],
        texto: '',
      }
    },
created(){
  
  this.notasFiltradas = this.tasks;
  this.leerDatos();
},

    computed:{
          filtro:{
            get(){
              return this.texto
            },
            set(value){
              console.log('filtro ejecutado!');
              value = value.toLowerCase();
              this.notasFiltradas = this.tasks.filter(nota => nota.texto.toLowerCase().indexOf(value) !== -1)
              this.texto = value
            }
          }
        },

    methods: {
      async leerDatos(){
        try {          
          const query = await db.collection('tareas').get()
          query.forEach(element => {
            let task = {id: element.id, texto: element.data().texto, estado: element.data().estado}
            this.tasks.push(task);
          });
        } catch (error) {
          console.log(error);
        }
      },
      
      async saveWork () {
        try {
          const query = await db.collection('tareas').add({
            texto: this.editor,
            estado: false
          })
          this.tasks.push({
            texto: this.editor,
            estado: false,
            id: query.id
          })
          this.editor = '';
          this.notasFiltradas = this.tasks;
          this.$q.notify({
            message: 'Tarea Guardada con éxito!',
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done'
          })
        } catch (error) {
          this.$q.notify({
            message: error,
            color: 'red',
            textColor: 'white',
            icon: 'clear'
          })
        } 
      },
      
      editar(index, id){
        this.editor = this.tasks[index].texto
        this.index = index;
        this.modoEdicion = true;  
        this.id = id;
      },
      async updateWork(){
        try {
          
          const query = await db.collection('tareas').doc(this.id).update({
            texto: this.editor
          })

          this.tasks[this.index].texto = this.editor;
          this.$q.notify({
            message: 'Tarea actualizada con éxito!',
            color: 'dark',
            textColor: 'white',
            icon: 'cloud_done'
          })
        } catch (error) {
          this.$q.notify({
            message: error,
            color: 'red',
            textColor: 'white',
            icon: 'clear'
          })
        } finally {
          this.index = null;
          this.id = null;
          this.modoEdicion = false;  
          this.editor = '';

        }
      },
                  
      eliminar(index, id){
        this.$q.dialog({
          title: 'Cuidado!',
          message: 'Desea eliminar la nota?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          try {
            
            const query = await db.collection('tareas').doc(id).delete()
            this.tasks.splice(index, 1);
          
          } catch (error) {
            this.$q.notify({
              message: error,
              color: 'red',
              textColor: 'white',
              icon: 'clear'
            })
          } 
        })
      }
    },
};
  
</script>
