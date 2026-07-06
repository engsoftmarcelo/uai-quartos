"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Bath,
  Building2,
  Loader2,
  MapPinned,
  Navigation,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-provider";
import { api } from "@/lib/api";

interface PropertyRoom {
  id: string;
  title: string;
  basePrice: number;
  isAvailable: boolean;
  privateBathroom: boolean;
  capacity: number;
}

interface PropertyResponse {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  imageUrl?: string | null;
  location: {
    lat: number;
    lng: number;
  };
  minPrice: number;
  availableRooms: number;
  amenities: string[];
  rooms: PropertyRoom[];
  distanceMetros?: number;
}

const searchSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().min(100).max(50000),
  maxPrice: z.number().min(100).max(10000),
  privateBathroom: z.boolean(),
  amenities: z.string(),
});

const propertySchema = z.object({
  name: z.string().min(3, "Informe o nome da república"),
  address: z.string().min(4, "Informe o endereço"),
  neighborhood: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  description: z.string().max(2000).optional(),
  imageUrl: z.union([z.string().url("URL invalida"), z.literal("")]),
  roomTitle: z.string().min(3, "Informe o quarto"),
  basePrice: z.number().min(100),
  privateBathroom: z.boolean(),
  capacity: z.number().min(1).max(6),
  amenities: z.string(),
});

type SearchValues = z.infer<typeof searchSchema>;
type PropertyValues = z.infer<typeof propertySchema>;

const defaultCenter = {
  lat: -19.9236,
  lng: -43.9928,
};

export function PropertyWorkspace() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [mine, setMine] = useState<PropertyResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMine, setIsLoadingMine] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canManageProperties = user?.role === "LANDLORD" || user?.role === "ADMIN";
  const selectedProperty =
    properties.find((property) => property.id === selectedId) ?? properties[0];

  const searchForm = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      radius: 3000,
      maxPrice: 1200,
      privateBathroom: false,
      amenities: "",
    },
  });

  const createForm = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "Rua Padre Eustaquio, 1200",
      neighborhood: "Coração Eucarístico",
      city: "Belo Horizonte",
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      description: "",
      imageUrl: "",
      roomTitle: "Quarto individual mobiliado",
      basePrice: 850,
      privateBathroom: false,
      capacity: 1,
      amenities: "wifi, lavanderia, cozinha equipada",
    },
  });

  const currentSearch = useWatch({ control: searchForm.control }) as SearchValues;

  const loadProperties = useCallback(
    async (values: SearchValues = searchForm.getValues()) => {
      setIsSearching(true);
      setFeedback(null);

      try {
        const { data } = await api.get<PropertyResponse[]>("/properties", {
          params: {
            lat: values.lat,
            lng: values.lng,
            radius: values.radius,
            maxPrice: values.maxPrice,
            privateBathroom: values.privateBathroom || undefined,
            amenities: values.amenities || undefined,
            onlyAvailable: true,
            limit: 24,
          },
        });
        setProperties(data);
        setSelectedId(data[0]?.id ?? null);
      } catch (error) {
        setFeedback(getErrorMessage(error));
      } finally {
        setIsSearching(false);
      }
    },
    [searchForm],
  );

  const loadMine = useCallback(async () => {
    if (!canManageProperties) {
      setMine([]);
      return;
    }

    setIsLoadingMine(true);

    try {
      const { data } = await api.get<PropertyResponse[]>("/properties/my");
      setMine(data);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsLoadingMine(false);
    }
  }, [canManageProperties]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  async function onSearch(values: SearchValues) {
    await loadProperties(values);
  }

  async function onCreate(values: PropertyValues) {
    setFeedback(null);

    try {
      await api.post("/properties", {
        name: values.name,
        address: values.address,
        neighborhood: values.neighborhood,
        city: values.city,
        state: "MG",
        lat: values.lat,
        lng: values.lng,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
        rooms: [
          {
            title: values.roomTitle,
            basePrice: values.basePrice,
            privateBathroom: values.privateBathroom,
            capacity: values.capacity,
            amenities: splitAmenities(values.amenities),
          },
        ],
      });

      createForm.reset({
        ...createForm.getValues(),
        name: "",
        description: "",
        imageUrl: "",
      });
      await Promise.all([loadProperties(), loadMine()]);
      setFeedback("República cadastrada no inventário.");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  async function deleteProperty(id: string) {
    setFeedback(null);

    try {
      await api.delete(`/properties/${id}`);
      await Promise.all([loadProperties(), loadMine()]);
      setFeedback("República desativada com soft delete.");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  return (
    <section className="grid gap-5 rounded-lg border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 border-b border-[#edf1e9] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
            Sprint 2
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#191b18]">
            Motor cartografico
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#174d3d]">
          <MapPinned className="h-4 w-4" />
          PostGIS + Inventário
        </div>
      </div>

      <form
        className="grid gap-3 lg:grid-cols-[repeat(6,minmax(0,1fr))]"
        onSubmit={searchForm.handleSubmit(onSearch)}
      >
        <NumberField
          label="Lat"
          step="0.0001"
          {...searchForm.register("lat", { valueAsNumber: true })}
        />
        <NumberField
          label="Lng"
          step="0.0001"
          {...searchForm.register("lng", { valueAsNumber: true })}
        />
        <NumberField
          label="Raio m"
          step="100"
          {...searchForm.register("radius", { valueAsNumber: true })}
        />
        <NumberField
          label="Max R$"
          step="50"
          {...searchForm.register("maxPrice", { valueAsNumber: true })}
        />
        <label className="flex h-11 items-center gap-2 self-end rounded-md border border-[#dfe5d9] px-3 text-sm font-medium text-[#343832]">
          <input
            className="h-4 w-4 accent-[#27735d]"
            type="checkbox"
            {...searchForm.register("privateBathroom")}
          />
          Banheiro
        </label>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-md bg-[#27735d] px-3 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:bg-[#9ab9ad]"
          disabled={isSearching}
          type="submit"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Buscar
        </button>
        <div className="lg:col-span-6">
          <FieldLabel label="Comodidades" />
          <input
            className="mt-2 h-11 w-full rounded-md border border-[#dfe5d9] px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
            placeholder="wifi, lavanderia"
            {...searchForm.register("amenities")}
          />
        </div>
      </form>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <MapSurface
          center={{ lat: currentSearch.lat, lng: currentSearch.lng }}
          properties={properties}
          radius={currentSearch.radius}
          selectedId={selectedProperty?.id ?? null}
          onSelect={setSelectedId}
        />

        <div className="grid content-start gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#343832]">
              {properties.length} resultados
            </p>
            <SlidersHorizontal className="h-4 w-4 text-[#5b6258]" />
          </div>
          {properties.length ? (
            properties.map((property) => (
              <PropertyCard
                isSelected={property.id === selectedProperty?.id}
                key={property.id}
                property={property}
                onSelect={() => setSelectedId(property.id)}
              />
            ))
          ) : (
            <EmptyState text="Nenhuma república encontrada nesse raio." />
          )}
        </div>
      </div>

      {canManageProperties ? (
        <div className="grid gap-5 border-t border-[#edf1e9] pt-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <form className="grid gap-3" onSubmit={createForm.handleSubmit(onCreate)}>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#27735d]" />
              <h3 className="text-lg font-semibold">Cadastro do locador</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Nome" {...createForm.register("name")} />
              <TextField label="Bairro" {...createForm.register("neighborhood")} />
              <TextField
                className="sm:col-span-2"
                label="Endereço"
                {...createForm.register("address")}
              />
              <TextField label="Cidade" {...createForm.register("city")} />
              <TextField label="Imagem URL" {...createForm.register("imageUrl")} />
              <NumberField
                label="Lat"
                step="0.0001"
                {...createForm.register("lat", { valueAsNumber: true })}
              />
              <NumberField
                label="Lng"
                step="0.0001"
                {...createForm.register("lng", { valueAsNumber: true })}
              />
            </div>
            <textarea
              className="min-h-24 rounded-md border border-[#dfe5d9] px-3 py-2 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
              placeholder="Descrição curta da república"
              {...createForm.register("description")}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Quarto" {...createForm.register("roomTitle")} />
              <NumberField
                label="Preço"
                step="50"
                {...createForm.register("basePrice", { valueAsNumber: true })}
              />
              <NumberField
                label="Capacidade"
                step="1"
                {...createForm.register("capacity", { valueAsNumber: true })}
              />
              <label className="flex h-11 items-center gap-2 self-end rounded-md border border-[#dfe5d9] px-3 text-sm font-medium text-[#343832]">
                <input
                  className="h-4 w-4 accent-[#27735d]"
                  type="checkbox"
                  {...createForm.register("privateBathroom")}
                />
                Banheiro privativo
              </label>
            </div>
            <TextField
              label="Comodidades"
              {...createForm.register("amenities")}
            />
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#27735d] px-4 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:bg-[#9ab9ad]"
              disabled={createForm.formState.isSubmitting}
              type="submit"
            >
              {createForm.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Publicar república
            </button>
          </form>

          <div className="grid content-start gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Meu inventário</h3>
              {isLoadingMine ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#27735d]" />
              ) : null}
            </div>
            {mine.length ? (
              mine.map((property) => (
                <div
                  className="grid gap-2 rounded-md border border-[#dfe5d9] p-3"
                  key={property.id}
                >
                  <div>
                    <p className="font-semibold">{property.name}</p>
                    <p className="text-sm text-[#5b6258]">
                      {property.neighborhood ?? property.city ?? "Sem bairro"}
                    </p>
                  </div>
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#f0b8a8] text-sm font-semibold text-[#8a3521] transition hover:bg-[#fff4ef]"
                    type="button"
                    onClick={() => void deleteProperty(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Desativar
                  </button>
                </div>
              ))
            ) : (
              <EmptyState text="Nenhuma república cadastrada por você." />
            )}
          </div>
        </div>
      ) : null}

      {feedback ? (
        <p className="rounded-md border border-[#dfe5d9] bg-[#f8faf6] px-3 py-2 text-sm text-[#343832]">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function MapSurface({
  center,
  properties,
  radius,
  selectedId,
  onSelect,
}: {
  center: { lat: number; lng: number };
  properties: PropertyResponse[];
  radius: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const markers = useMemo(
    () =>
      properties.map((property) => ({
        property,
        position: projectMarker(center, property.location, radius),
      })),
    [center, properties, radius],
  );

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#dfe5d9] bg-[#e8efe8]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,115,93,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(39,115,93,0.08)_1px,transparent_1px)] bg-[length:34px_34px]" />
      <div className="absolute left-5 top-5 rounded-md bg-white/95 px-3 py-2 text-sm shadow-sm">
        <p className="font-semibold text-[#174d3d]">Centro de busca</p>
        <p className="text-[#5b6258]">
          {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
        </p>
      </div>
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#27735d]/70 bg-[#27735d]/5" />
      <div className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-[#27735d] text-white shadow">
        <Navigation className="h-4 w-4" />
      </div>
      {markers.map(({ property, position }) => (
        <button
          className={`absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border text-white shadow-sm transition ${
            property.id === selectedId
              ? "border-[#191b18] bg-[#191b18]"
              : "border-white bg-[#27735d]"
          }`}
          key={property.id}
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          title={property.name}
          type="button"
          onClick={() => onSelect(property.id)}
        >
          <Building2 className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function PropertyCard({
  isSelected,
  property,
  onSelect,
}: {
  isSelected: boolean;
  property: PropertyResponse;
  onSelect: () => void;
}) {
  return (
    <button
      className={`grid gap-3 rounded-md border p-3 text-left transition ${
        isSelected
          ? "border-[#27735d] bg-[#f4fbf7]"
          : "border-[#dfe5d9] bg-white hover:bg-[#f8faf6]"
      }`}
      type="button"
      onClick={onSelect}
    >
      {property.imageUrl ? (
        <div
          aria-label={property.name}
          className="h-28 w-full rounded-md bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${property.imageUrl})` }}
        />
      ) : null}
      <div>
        <p className="font-semibold text-[#191b18]">{property.name}</p>
        <p className="text-sm text-[#5b6258]">
          {[property.neighborhood, property.city].filter(Boolean).join(", ")}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <Badge icon={Banknote} text={formatCurrency(property.minPrice)} />
        <Badge icon={Building2} text={`${property.availableRooms} vagas`} />
        <Badge
          icon={Bath}
          text={
            property.rooms.some((room) => room.privateBathroom)
              ? "Privativo"
              : "Compart."
          }
        />
      </div>
      {property.distanceMetros ? (
        <p className="text-sm font-medium text-[#174d3d]">
          {property.distanceMetros} m do ponto
        </p>
      ) : null}
      {property.amenities.length ? (
        <p className="line-clamp-2 text-sm text-[#5b6258]">
          {property.amenities.join(" · ")}
        </p>
      ) : null}
    </button>
  );
}

function Badge({
  icon: Icon,
  text,
}: {
  icon: typeof Banknote;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#eef2ea] px-2 py-1 font-semibold text-[#343832]">
      <Icon className="h-3.5 w-3.5 text-[#27735d]" />
      {text}
    </span>
  );
}

function NumberField({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className={`grid gap-2 ${className ?? ""}`}>
      <FieldLabel label={label} />
      <input
        className="h-11 rounded-md border border-[#dfe5d9] px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
        type="number"
        {...props}
      />
    </label>
  );
}

function TextField({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className={`grid gap-2 ${className ?? ""}`}>
      <FieldLabel label={label} />
      <input
        className="h-11 rounded-md border border-[#dfe5d9] px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
        type="text"
        {...props}
      />
    </label>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <span className="text-sm font-medium text-[#343832]">{label}</span>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-[#d0d8ca] bg-[#f8faf6] p-4 text-sm text-[#5b6258]">
      {text}
    </div>
  );
}

function projectMarker(
  center: { lat: number; lng: number },
  point: { lat: number; lng: number },
  radius: number,
) {
  const metersPerLat = 111_320;
  const metersPerLng = metersPerLat * Math.cos((center.lat * Math.PI) / 180);
  const dx = (point.lng - center.lng) * metersPerLng;
  const dy = (point.lat - center.lat) * metersPerLat;
  const scale = Math.max(radius, 100);

  return {
    x: clamp(50 + (dx / scale) * 42, 8, 92),
    y: clamp(50 - (dy / scale) * 42, 8, 92),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function splitAmenities(input: string) {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(value);
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: unknown };

    if (Array.isArray(data.message)) {
      return data.message.join(" ");
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Não foi possível concluir a operação.";
}
