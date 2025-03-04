import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/seo";

export default function AdminIndex() {
  const { data: products = [] } = useQuery({ queryKey: ["/api/products"] });
  const { data: banners = [] } = useQuery({ queryKey: ["/api/banners"] });
  const { data: categories = [] } = useQuery({ queryKey: ["/api/categories"] });

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Active Banners", value: banners.filter((b) => b.active).length },
    { label: "Categories", value: categories.length },
  ];

  return (
    <AdminLayout>
      <SEO 
        title="Yönetim Paneli"
        description="E-ticaret sitesi yönetim paneli - ürünler, kategoriler ve banner yönetimi"
        type="website"
      />
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-lg">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}